  function readFile() {
      var files = document.getElementById('datafile').files;
      if (!files.length) {
          alert('Please select a file!');
          return;
      }

      var file = files[0];

      var reader = new FileReader();

      reader.onloadend = function(evt) {
          if (evt.target.readyState == FileReader.DONE) { // DONE == 2
              var contentArea = document.getElementById('file_content');
              var FileContens = evt.target.result;


              contentArea.innerHTML = parseFile(FileContens);
              contentArea.hidden = false;


              var parseArea = document.getElementById('parse_content');
              parseArea.textContent = FileContens;
              parseArea.hidden = false;
          }
      };

      reader.readAsText(file);
  }


  function parseFile(FileContens) {

    // 將檔案內容以行為單位儲存
    var lines = FileContens.split('\n');
    var outputContent;
    // 處理每一行的內容
    for(var i = 0; i < lines.length; i++)
    {
      var line = lines[i];

      var result;
      var start = '<font color="red">';
      var end = '</font>';

      if (isChapter(line)) {
        result = start + line + end;
      }
      else {
        result = line;
      }

      outputContent = (outputContent || "") + result;
    }

    return outputContent;
  }


  function isChapter(str) {
    var patt = /(第?([0-9]|[零一二三四五六七八九十百千零壹貳參肆伍陸柒捌玖拾佰仟初兩])+章)|楔子/i;

    if(str.search(patt) != -1)
    {
      return true;
    }
    else
    {
      return false;
    }
  }
