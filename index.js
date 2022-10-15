const { fstat, writeFileSync } = require('fs');



const reading = (fileName) => {
    var lineReader = require('readline').createInterface({
        input: require('fs').createReadStream('logs/'+ fileName)
      });
      let index = 0
      let csvData = ''

    return new Promise((resolve ) => {
        lineReader.on('line', function (line) {
            index++
            // if (index > 10) return 
            const proceedLine = line.replace(/.*?{/, '{');
            try {
               const json = JSON.parse(proceedLine)
            //    console.log('json', json)
               const result = `${json.requestHeader?.referer ?? ''}|'${proceedLine}'`
        
            //    console.log(result)
               csvData += `\r\n${result}`
            } catch (error) {
                
                // console.error(error,proceedLine, line)
            }
         
          }).on('close', () => {
            console.log('done...')
            const [name] = fileName.split('.')
            writeFileSync('results/'+name+'.csv', csvData, 'utf-8')
            return resolve()
          });
    })
      
    
}



const main = async () => {
    const FILENAMES = ['info-2022-10-01.log','info-2022-10-02.log']
    await Promise.all(FILENAMES.map(fileName => reading(fileName)))
    console.log('all export done....')
}


main()