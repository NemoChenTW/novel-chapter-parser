// 設定繼承
function extend(child, supertype)
{
   child.prototype.__proto__ = supertype.prototype;
}

// 定義 TextContent
function TextContent(content){
  this.content = content || '';
}
TextContent.prototype = {
  isEmpty : function () {
    return (this.content == '' || this.content == null);
  },
  AddContent : function (content) {
    this.content += content;
  }
}

function IParseNovel() {}
IParseNovel.prototype = {
  parseAllTitles : function () {
    this.parsedTitle = this.title;
  },
  parseAllContents : function () {
    this.parsedContent = this.originContent;
  }
}

// 定義 ChapterObj
function ChapterObj(title, content){
  this.title = title || '';
  this.originContent = new TextContent(content || '');
  this.parsedTitle = '';
  this.parsedContent = '';
}
ChapterObj.prototype = {
  isEmpty : function () {
    return (this.isTitleEmpty() && this.isContentEmpty());
  },
  isTitleEmpty : function () {
    return (this.title == '' || this.title == null);
  },
  isContentEmpty : function () {
    return (this.originContent.isEmpty());
  },
  print : function () {
    return this.title + this.originContent.content;
  },
  printParseResult : function () {
    return this.parsedTitle + this.parsedContent.content;
  },
  AddContent : function (content) {
    this.originContent.AddContent(content);
  },
  runParse : function () {
    this.parseAllTitles();
    this.parseAllContents();
  }
}
// 設定 ChapterObj 繼承 IParseNovel
extend(ChapterObj, IParseNovel);

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
              $('#button_save').show();

          }
      };

      reader.readAsText(file);
  }

  function saveFile(inputText)
  {
  	var textToWrite = inputText || document.getElementById('parse_content').textContent;
  	var textFileAsBlob = new Blob([textToWrite], {type:'text/plain'});
    var fileNameToSaveAs = 'NewFile'
  	// var fileNameToSaveAs = document.getElementById('inputFileNameToSaveAs').value;

  	var downloadLink = document.createElement('a');
  	downloadLink.download = fileNameToSaveAs;
  	downloadLink.innerHTML = 'Download File';
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
  		downloadLink.style.display = 'none';
  		document.body.appendChild(downloadLink);
  	}

  	downloadLink.click();
  }
  function destroyClickedElement(event)
  {
  	document.body.removeChild(event.target);
  }


  function parseFile(FileContens) {

    var ContentArray = [];
    var resultContent = {
      originalContent : '',
      parseContent : '',
      CapturedTitles : ''
    };
    var contentItem = new ChapterObj();
    IParseNovel.prototype.parseAllTitles = function () {
      if(!this.isTitleEmpty()){
        this.parsedTitle = '<chapter> ' + this.title;
      }
    }

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
        //若原本已經有內容, 先儲存起來
        if(!contentItem.isEmpty())
        {
          ContentArray.push(contentItem);
        }
        // 建立新章節物件
        var chapterTitle = line + '\n';
        contentItem = new ChapterObj(chapterTitle);

        resultContent.CapturedTitles += (start + chapterTitle + end);
      }
      else {
        contentItem.AddContent(line + '\n');
      }
    }
    // 儲存最後一個處理的物件
    if(!contentItem.isEmpty())
    {
      ContentArray.push(contentItem);
    }

    // 處理所有內容
    for (var i = 0; i < ContentArray.length; i++) {
      ContentArray[i].runParse();
      resultContent.originalContent = (resultContent.originalContent || '') + ContentArray[i].print();
      resultContent.parseContent = (resultContent.parseContent || '') + ContentArray[i].printParseResult();
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
