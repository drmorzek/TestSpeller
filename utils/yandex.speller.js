const requestHTTP = require('./request');

const cache = {}

module.exports = async function (text) {
  try {
      let newText = text
      let chunks = text.replace(/\r\n|\n\r|\n|\r/g, "\n").split(/\s+|\n/).filter(e => e !== '')
      chunks = [...new Set(chunks)]
    
      let chunksFromCache = chunks.filter(e => !cache[e] )

      let url = "https://speller.yandex.net/services/spellservice.json/checkText?"

      while (chunksFromCache.length > 0) {
          let res = await requestHTTP(url + "text=" + chunksFromCache.splice(0, 20).join(" "))
          res.forEach( e => {
              cache[e.word] = e.s[0] || e.word
          })
      }
      
      chunks.forEach(function(elem) {
          if(!cache[elem]) cache[elem] = elem
          newText = newText.replaceAll(
            elem, cache[elem] 
          )
      })
      
      return newText
  } catch (error) {
      console.log("speller", error);
  }

}