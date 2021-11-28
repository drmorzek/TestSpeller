const requestHTTP = require('./request');

module.exports = async function (text) {
  try {
      let newText = text
      let chunks = text.replace(/\r\n|\n\r|\n|\r/g, "\n").split(/\s+|\n/).filter(e => e !== '')
      chunks = [...new Set(chunks)]
      let url = "https://speller.yandex.net/services/spellservice.json/checkText?"
      let arr = []

      while (chunks.length > 0) {
          let res = await requestHTTP(url + "text=" + chunks.splice(0, 20).join(" "))
          arr = arr.concat(res)
      }

      
      arr.forEach(function(elem) {
          newText = newText.replaceAll(
              elem.word,
              elem.s[0] || elem.word
          )
      })
      
      return newText
  } catch (error) {
      console.log("speller", error);
  }

}