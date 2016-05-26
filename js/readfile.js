// 定義 TextContent
function TextContent(content){
  this.content = content || "";
}
TextContent.prototype = {
  AddContent : function (content) {
    this.content += content;
  }
}
// 定義 ChapterObj
function ChapterObj(title, content){
  this.title = title || "";
  this.originContent = new TextContent(content || "");
  this.parsedContent = "";

  this.parse = function () {};
}
ChapterObj.prototype = {
  print : function () {
    return this.title + "\n" + this.originContent.content + "\n";
  },
  AddContent : function (content) {
    this.originContent.AddContent(content);
  },
  setParseFun : function (parseFunction) {
    this.parse = parseFunction;
  },
  runParse : function () {
    this.parse();
  }
}

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


              var resContent = parseFile(FileContens);
              contentArea.innerHTML = resContent.originalContent;
              contentArea.hidden = false;


              var parseArea = document.getElementById('parse_content');
              parseArea.textContent = resContent.parseContent;
              parseArea.hidden = false;

              // 顯示 存檔按鈕
              $("#button_save").show();

          }
      };

      reader.readAsText(file);
  }

  function saveFile()
  {
  	var textToWrite = document.getElementById("parse_content").textContent;
  	var textFileAsBlob = new Blob([textToWrite], {type:'text/plain'});
    var fileNameToSaveAs = "NewFile"
  	// var fileNameToSaveAs = document.getElementById("inputFileNameToSaveAs").value;

  	var downloadLink = document.createElement("a");
  	downloadLink.download = fileNameToSaveAs;
  	downloadLink.innerHTML = "Download File";
  	if (window.webkitURL != null)
  	{
  		// Chrome allows the link to be clicked
  		// without actually adding it to the DOM.
  		downloadLink.href = window.webkitURL.createObjectURL(textFileAsBlob);
  	}
  	else
  	{
  		// Firefox requires the link to be added to the DOM
  		// before it can be clicked.
  		downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
  		downloadLink.onclick = destroyClickedElement;
  		downloadLink.style.display = "none";
  		document.body.appendChild(downloadLink);
  	}

  	downloadLink.click();
  }
  function destroyClickedElement(event)
  {
  	document.body.removeChild(event.target);
  }


  function parseFile(FileContens) {

    var resultContent = {
      originalContent : "",
      parseContent : ""
    };

    // 將檔案內容以行為單位儲存
    var lines = FileContens.split('\n');

    // 處理每一行的內容
    for(var i = 0; i < lines.length; i++)
    {
      var line = lines[i];

      var originalResult, parseResult;
      var start = '<font color="red">';
      var end = '</font>';

      if (isChapter(line)) {
        originalResult = start + line + end;
        parseResult = "<chapter> " + line;
      }
      else {
        originalResult = line;
        parseResult = line;
      }

      resultContent.originalContent = (resultContent.originalContent || "") + originalResult;
      resultContent.parseContent = (resultContent.parseContent || "") + parseResult + '\n';
    }

    return resultContent;
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
