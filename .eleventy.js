const CleanCSS = require("clean-css");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const fs = require('fs');
const md5 = require('md5');
const fileChecker = require ("https");
const langData = JSON.parse(fs.readFileSync('pages/_data/langData.json','utf8'));
const dateFormats = JSON.parse(fs.readFileSync('pages/_data/dateformats.json','utf8'));
const statsData = JSON.parse(fs.readFileSync('pages/_data/caseStats.json','utf8')).Table1[0];
let htmlmap = [];
if(fs.existsSync('pages/_data/htmlmap.json')) {
  htmlmap = JSON.parse(fs.readFileSync('pages/_data/htmlmap.json','utf8'));
}
let miniCSS = '';

//RegExp for removing language suffixes - /(?:-es|-tl|-ar|-ko|-vi|-zh-hans|-zh-hant)$/
const langPostfixRegExp = new RegExp(`(?:${langData.languages
  .map(x=>x.filepostfix)
  .filter(x=>x)
  .join('|')})$`);

module.exports = function(eleventyConfig) {
  //Copy static assets
  eleventyConfig.addPassthroughCopy({ "./src/css/fonts": "fonts" });
  eleventyConfig.addPassthroughCopy({ "./src/img": "img" });
  eleventyConfig.addPassthroughCopy({ "./src/js/maps": "js/maps" });
  eleventyConfig.addPassthroughCopy({ "./pages/rootcopy": "/" });
  //azure-pipelines-staging.yml

  //Process manual content folder
  eleventyConfig.addCollection("manualcontent", function(collection) {
    const manualContentFolderName = 'manual-content';
    let output = [];
    collection.getAll().forEach(item => {
      if(item.inputPath.includes(manualContentFolderName)) {
        item.outputPath = item.outputPath.replace(`/${manualContentFolderName}`,'');
        item.url = item.url.replace(`/${manualContentFolderName}`,'');
        item.data.page.fileSlug = item.data.page.fileSlug.replace(manualContentFolderName,'');
        item.data.page.url = item.data.page.url.replace(`/${manualContentFolderName}`,'');
        output.push(item);
      };
    });

    return output;
  });

  //Replaces content to rendered
  const replaceContent = (item,searchValue,replaceValue) => {
    item.template.frontMatter.content = item.template.frontMatter.content
      .replace(searchValue,replaceValue);
  }

  //Process translated posts
  let translatedPaths = []
  eleventyConfig.addCollection("translatedposts", function(collection) {
    const FolderName = 'translated-posts';
    let output = [];
    
    collection.getAll().forEach(item => {
      //fix all http/https links to covid sites
      replaceContent(item,/"http:\/\/covid19.ca.gov\//g,`"https://covid19.ca.gov/`);
      replaceContent(item,/"http:\/\/files.covid19.ca.gov\//g,`"https://files.covid19.ca.gov/`);
      replaceContent(item,/"https:\/\/covid19.ca.gov\/pdf\//g,`"https://files.covid19.ca.gov/pdf/`);
      replaceContent(item,/"https:\/\/covid19.ca.gov\/img\//g,`"https://files.covid19.ca.gov/img/`);

        if(item.inputPath.includes(FolderName)) {
          //update translated paths.
          const langrecord = getLangRecord(item.data.tags);
          const getTranslatedPath = path =>
            path
              .replace(`${langrecord.filepostfix}/`,`/`)
              .replace(`${FolderName}/`,`${langrecord.pathpostfix}`);

          //quick check to see if the tag matches the file name
          if(!item.url.endsWith(langrecord.filepostfix+'/')) {
            console.error(`lang tag does not match file name. ${item.url} ≠ ${langrecord.filepostfix} `);
          }
    
          replaceContent(item,/"https:\/\/covid19.ca.gov\//g,`"/${langrecord.pathpostfix}`);

          item.outputPath = getTranslatedPath(item.outputPath)
          translatedPaths.push(item.outputPath);
          item.url = getTranslatedPath(item.url);
          item.data.page.url = item.url;
          output.push(item);

          if(!item.data.title) {
            //No title means fragment
            // console.log(`Skipping fragment ${item.inputPath}`)
            item.outputPath = false;
          }
        };
    });

    return output;
  });

  //Process wordpress posts
  eleventyConfig.addCollection("wordpressposts", function(collection) {
    const FolderName = 'wordpress-posts';
    let output = [];
    
    collection.getAll().forEach(item => {
        if(item.inputPath.includes(FolderName)) {
          let outputPath = item.outputPath.replace(`/${FolderName}`,'');
          if(translatedPaths.indexOf(outputPath) === -1) {
            //This page is not in the AvantPage list
            item.outputPath = outputPath;
            item.url = item.url.replace(`/${FolderName}`,'');
            item.data.page.url = item.url;
            output.push(item);

            if(!item.data.title) {
              //No title means fragment
              // console.log(`Skipping fragment ${item.inputPath}`)
              item.outputPath = false;
            }
          } else {
            //Turn this page off since we already have a translation
            output.push(item);
            item.outputPath = false;
            // console.log(`Skipping traslated page ${item.inputPath}`)
          }
        };
    });

    return output;
  });
  
  eleventyConfig.addCollection("covidGuidance", function(collection) {
    let posts = [];
    collection.getAll().forEach( (item) => {
      if(item.data.tags && item.data.tags[0] == 'guidancefeed') {
        posts.push(item);
      }
    })
    return posts.slice().sort(function(a, b) {
      let bPub = new Date(b.data.publishdate);
      let aPub = new Date(a.data.publishdate)
      return bPub.getTime() - aPub.getTime();
    });
  });


  //usage
  //    {{ 'My Error message' | error }}
  eleventyConfig.addFilter('error', errorMessage => {
    if (errorMessage)
      throw errorMessage;
    else
      return null;
  }
  );

  eleventyConfig.addFilter('find', (array, field, value) => array.find(x=>x[field]===value));

  eleventyConfig.addFilter("cssmin", function(code) {
    if(!miniCSS) {
      miniCSS = new CleanCSS({}).minify(code).styles;
    }
    return miniCSS;
  });

  // Format dates within templates.
  eleventyConfig.addFilter('formatDate', function(datestring) {
    const locales = 'en-US';
    const timeZone = 'America/Los_Angeles';
  if(datestring&&datestring.indexOf('Z') > -1) {
      const date = new Date(datestring);
      return `${date.toLocaleDateString(locales, { timeZone, day: 'numeric', month: 'long', year: 'numeric' })} at ${date.toLocaleTimeString(locales, { timeZone, hour: 'numeric', minute: 'numeric' })}`;
    } else if(datestring === 'today') {
      const date = new Date();
      return `${date.toLocaleDateString(locales, { timeZone, day: 'numeric', month: 'long', year: 'numeric' })} at ${date.toLocaleTimeString(locales, { timeZone, hour: 'numeric', minute: 'numeric' })}`;
    } else {
      return datestring;
    }
  });

  eleventyConfig.addFilter('formatDate2', function(datestring,withTime,tags,addDays) {
    return formatDate(datestring,withTime,tags,addDays);
  });

  const formatDate = (datestring, withTime, tags, addDays) => {
    const locales = 'en-US';
    const timeZone = 'America/Los_Angeles';
    
    if(datestring) {
      let targetdate =
        datestring==='today'
          ? new Date()
          : datestring.indexOf('Z') > -1
            ? new Date(datestring)
            : new Date(`${new Date().getUTCFullYear()}-${datestring}T08:00:00.000Z`);
      if(targetdate) {
        if(addDays) {
          targetdate.setUTCDate(targetdate.getUTCDate() + addDays);
        }

        const langId = getLangRecord(tags).id;
        const formatRecord = dateFormats[langId.toLowerCase()];

        const defaultTimeString = targetdate.toLocaleTimeString(locales, { timeZone, hour: 'numeric', minute: '2-digit' })
        const dateHours = Number(defaultTimeString.split(' ')[0].split(':')[0]);
        const dateMinutes = defaultTimeString.split(' ')[0].split(':')[1];
        const dateAm = defaultTimeString.split(' ')[1]==='AM';
        const dateYear = Number(targetdate.toLocaleDateString(locales, { timeZone, year: 'numeric' }));
        const dateDay = Number(targetdate.toLocaleDateString(locales, { timeZone, day: 'numeric' }));
        const dateMonth = Number(targetdate.toLocaleDateString(locales, { timeZone, month: 'numeric' }))-1;

        const dateformatstring = formatRecord
          .monthdayyear[dateMonth]
          .replace('[day]',dateDay)
          .replace('[year]',dateYear);

        const timeformatstring = 
          (dateAm
            ? formatRecord.timeam
            : formatRecord.timepm
          )
          .replace('[hour-12]',dateHours)
          .replace('[hour-24]',(dateHours+(dateAm ? 0 : 12)))
          .replace('[min]',dateMinutes);

        if(withTime) {
          return formatRecord.joinstring
            .replace('[date]',dateformatstring)
            .replace('[time]',timeformatstring);
        } else {
          return dateformatstring;
        }
      }
    }
    return datestring;
  }
  

  eleventyConfig.addFilter('formatDateParts', function(datestring, adddays) {
    return formatDate(datestring,null,null,adddays);
  })

  eleventyConfig.addFilter('formatDatePartsPlus1', function(datestring) {
    return formatDate(datestring,null,null,1);
  })

  

  eleventyConfig.addFilter('truncate220', function(textstring) {
    if(!textstring || textstring.length <221) {
      return textstring.slice(0,220)+'...';
    }
    return textstring;
  });

  eleventyConfig.addFilter('_statsdata_', index => Object.values(statsData)[index]);
  //Usage...
  //        {{0|_statsdata_}}

  const contentfrompage = (content, page, slug) => {
    if(page.fileSlug && slug && page.fileSlug.toLocaleLowerCase().startsWith(slug.toLocaleLowerCase())) {
      return content;
    }
    return "";
  }

  const getTranslatedValue = (pageObj, tags, field) => {
    
    let langTag = getLangRecord(tags);
    
    if(!pageObj)
      return "";

    if(pageObj[langTag.wptag] && pageObj[langTag.wptag][field]) {
      return pageObj[langTag.wptag][field];
    } 
    //that page is missing for that lang, bring in the default
    return pageObj[getLangRecord([]).wptag][field];
  }

  // return the active class for a matching string
  eleventyConfig.addFilter('pageActive', (page, tags, pageObj) => contentfrompage(" active", page, getTranslatedValue(pageObj, tags, 'slug')));

  // return the translated url or title if appropriate
  eleventyConfig.addFilter('getTranslatedVal', getTranslatedValue);
  
  
  // show or hide content based on page
  eleventyConfig.addPairedShortcode("pagesection", contentfrompage);

  let processedPostMap = new Map();
  htmlmap.forEach(pair => {
    processedPostMap.set(pair[0],pair[1])
  })




  eleventyConfig.addTransform("findaccordions", function(html, outputPath) {
    const headerclass = 'wp-accordion';
    const contentclass = 'wp-accordion-content';

    if(outputPath&&outputPath.endsWith(".html")&&html.indexOf(headerclass)>-1) {
      let initialHTML = md5(html);
      if(processedPostMap.get(outputPath)!==initialHTML) {
        const dom = new JSDOM(html);
        const document = dom.window.document;

        for(const header of document.querySelectorAll(`.${headerclass}`)) {
          //create the wrapper element and wrap it around the header
          const cwdscontainer = document.createElement('cwds-accordion');
          const container = document.createElement('div');
          container.classList.add('card');
          cwdscontainer.appendChild(container);

          header.parentNode.insertBefore(cwdscontainer, header);
          container.appendChild(header);

          //remove the special wp class
          header.classList.remove(headerclass);
          if (header.classList.length===0) header.removeAttribute('class');

          //create the card body section and add it to the container
          const body = document.createElement('div');
          body.className="card-body";
          container.appendChild(body);

          //Add all remaining content classes to the card body, they must be directly after the new container
          let direct;
          while (direct = document.querySelector(`cwds-accordion + .${contentclass}`)) {
            body.appendChild(direct);

            //remove custom class name
            direct.classList.remove(contentclass);
            if (direct.classList.length===0) direct.removeAttribute('class');
          }

          //apply required html around components
          header.outerHTML=`
            <button class="card-header accordion-alpha" type="button" aria-expanded="false">
              <div class="accordion-title">
                ${header.outerHTML}
              </div>
            </button>`;

          body.outerHTML = `
            <div class="card-container" aria-hidden="true" style="height: 0px;">
              ${body.outerHTML}
            </div>`;
        }
        processedPostMap.set(outputPath,initialHTML);
        fs.writeFileSync('./pages/_data/htmlmap.json',JSON.stringify([...processedPostMap]),'utf8')
        return dom.serialize();
      }
    }
    return html;
  });


  eleventyConfig.addTransform("findlinkstolocalize", async function(html, outputPath) {
    let localizeString = '--en.';
    if(outputPath&&outputPath.endsWith(".html")&&html.indexOf(localizeString)>-1) {
      const dom = new JSDOM(html);
      const document = dom.window.document;
      let lang = langData.languages.filter(x=>x.enabled&& document.querySelector('html').lang == x.hreflang).concat(langData.languages[0])[0].id;
      if(lang !== "en") {
        for(const image of document.querySelectorAll(`img[src*='${localizeString}']`)) {
          let englishUrl = image.src;
          let localizedUrl = englishUrl.replace('--en.',`--${lang.toLowerCase()}.`);
          let localizedUri = localizedUrl.replace('https://files.covid19.ca.gov','');
          await new Promise(resolve => {
            fileChecker.get({
              host: "files.covid19.ca.gov", 
              port: 443, 
              path: localizedUri,
              method: "HEAD",
              agent: false  // Create a new agent just for this one request
            }, (res) => {
              if(res.statusCode === 200) {
                image.src = localizedUrl;
              }
              resolve('done')
            });
          });    
        }
        for(const link of document.querySelectorAll(`a[href*='${localizeString}']`)) {
          let englishUrl = link.href;

          let localizedUrl = englishUrl.replace('--en.',`--${lang.toLowerCase()}.`);
          let localizedUri = localizedUrl.replace('https://files.covid19.ca.gov','');
          await new Promise(resolve => {
            fileChecker.get({
              host: "files.covid19.ca.gov", 
              port: 443, 
              path: localizedUri,
              method: "HEAD",
              agent: false  // Create a new agent just for this one request
            }, (res) => {
              if(res.statusCode === 200) {
                link.href = localizedUrl;
              }
              resolve('done')
            });
          });    
        }
        return dom.serialize();  
      }      
    }
    return html;
  });

  eleventyConfig.addFilter('jsonparse', json => JSON.parse(json));
  eleventyConfig.addFilter('includes', (items,value) => (items || []).includes(value));

  const getLangRecord = tags =>
    langData.languages.filter(x=>x.enabled&&(tags || []).includes(x.wptag)).concat(langData.languages[0])[0];
  const getLangCode = tags => 
    getLangRecord(tags).hreflang;

  eleventyConfig.addFilter('lang', getLangCode);
  eleventyConfig.addFilter('langRecord', getLangRecord);
  eleventyConfig.addFilter('langFilePostfix', tags => getLangRecord(tags).filepostfix || "");
  eleventyConfig.addFilter('htmllangattributes', tags => {
    const langRecord = getLangRecord(tags);
    return `lang="${langRecord.hreflang}" xml:lang="${langRecord.hreflang}"${(langRecord.rtl ? ` dir="rtl"` : "")}`;
  });
  eleventyConfig.addFilter('npiSurveyUrl', tags => {
    const langRecord = getLangRecord(tags);
    return langRecord['npi-survey'];
  });
  eleventyConfig.addFilter('pulseSurveyUrl', tags => {
    const langRecord = getLangRecord(tags);
    return langRecord['pulse-survey'];
  });

  eleventyConfig.addFilter('publishdateorfiledate', page => 
    (page.data
      ? page.data.publishdate
      : page.publishdate) 
      || page.date.toISOString()
  );
  
  eleventyConfig.addPairedShortcode("dothisifcontentexists", (content, contentcontent, match) => 
    contentcontent.match(match) ? content : "");

  // return alternate language pages
  eleventyConfig.addFilter('getAltPageRows', page => {
    if(!page.url) {
      //skip "guidancefeed", etc. or pages with no output (permalink: false)
      return [];
    }

    let engSlug = page.fileSlug.replace(langPostfixRegExp,'');

    if(langData.languages.some(x=>engSlug===x.filepostfix.substring(1))) {
      //This is a root language page
      engSlug='';
    }
  
    return langData.languages
      .filter(x=>x.enabled)
      .map(x=>({
        url: `/${x.pathpostfix}${(engSlug)}/`.replace(/\/\/$/,'/'),
        langcode:x.id,
        langname:x.name
        }))
      .filter(x=>x.url!==page.url)
      ;
  });

  eleventyConfig.htmlTemplateEngine = "njk,findaccordions,findlinkstolocalize";
};

