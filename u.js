// Browser detection.

var ns4 = document.layers;
var ns6 = document.getElementById && !document.all;
var ie4 = document.all;
var iphone = ((navigator.userAgent.indexOf('iPhone') != -1) ||   
    (navigator.userAgent.indexOf('iPod') != -1));
var kindle = (navigator.userAgent.indexOf('Silk') != -1);
var Mac = (navigator.userAgent.indexOf('Macintosh') != -1);
var iPad = (navigator.userAgent.indexOf('iPad') != -1);
var Android = (navigator.userAgent.indexOf('Android') != -1);

var viewWidth = null;
var viewHeight = null;
var pageWidth = null;
var pageHeight = null;

var fontSize = null;
var fontName = null;
var bgColor = null;
var textHeight = null;

var availWidth = null;
var availHeight = null;
var colWidth = null;
var rowHeight = null;
var cols = null;
var rows = null;

var sourceText = null;
//var sourceTextLen = null; //
var fourByteUnicode = false;

var chapterBar = null;
var viewer = null;
var pageBar = null;

var chapterStatus = null;
var pageStatus = null;
var chapStatus = null;
var hidePageStatus = false;
var hideChapStatus = false;

var curPageIdx = -1;	// zero-based.
var curColIdx = -1;	// zero-based. left to right.
var curRowIdx = -1;	// zero-based. top to bottom.
var indent = 0;	// Because the indentation is already in the source text.
var BREAK = "\n";

var paras = null; // zero-based. Paragraphs of text.
var pagePointers = null; // zero-based. Points to Paragraph ID and a column.
var readingPoint = null;
var prevWheeltime;// = new Date().getTime();

function wheel(event){

   var wheeltime = new Date().getTime();
   var ms = wheeltime - prevWheeltime;
   if (ms < 100) return;
   prevWheeltime = wheeltime;

   var delta = 0;
   if (!event) {
      event = window.event;
      }
   if (event.wheelDelta) {
      delta = event.wheelDelta/120; 
      if (window.opera) delta = -delta;
      }
   else if (event.detail) {
      delta = -event.detail/3;
      }
   if (delta < 0) RenderNextPage();
   else if (delta > 0) RenderPrevPage();

   if (event.preventDefault) event.preventDefault();
   else event.returnValue = false;

   }

function Init() {

   InitView();
   InitLayout();

   if (window.addEventListener)
      window.addEventListener('DOMMouseScroll', wheel, false);
   window.onmousewheel = document.onmousewheel = wheel;

   prevWheeltime = new Date().getTime();
   
   // Detect window resizing.
//	window.onresize = OnViewportResized;
	window.onorientationchange = OnViewportRotated;

   }

function Coalesce(list) {
    var value = null;
    for (var i=0; i<arguments.length; i++)
    {
        if (arguments[i] != null && arguments[i] != "")
        {
            value = arguments[i];
            break;
        }
    }
    return value;
   }

function InitView() {

    // Determine the viewport dimensions.
//    width = parseInt(Coalesce(GetCookie("Width"), GetDefaultWidth()));
//    height = parseInt(Coalesce(GetCookie("Height"), GetDefaultHeight()));

//   alert(screen.height);

   viewWidth = GetDefaultWidth();
   viewHeight = GetDefaultHeight();   
   pageWidth = viewWidth;
   pageHeight = viewHeight - 60;
   if (chapterID == 0) pageHeight -= 20;
   availWidth = pageWidth - 80;
   availHeight = pageHeight - 80;
   if (pageHeight >= 800) {
      pageHeight -= 80;
      if (chapterID == 0) pageHeight += 80;
      availHeight -= 80;
      }	  
/*   
   if (screen.width == 800 && screen.height == 480) {
      pageWidth = viewWidth;
      pageHeight = viewHeight - 32;
      if (chapterID == 0) pageHeight = pageHeight - 40;
      availWidth = pageWidth - 100;
      availHeight = pageHeight - 40;
     }
   else if (iphone && screen.width == 320) { // iPhone
      viewWidth = GetDefaultWidth();
      viewHeight = GetDefaultHeight() + 40;
      pageWidth = viewWidth;
      pageHeight = viewHeight - 32;
      if (chapterID == 0) pageHeight = pageHeight - 40;
      availWidth = pageWidth - 40;
      if (availWidth > 400) availWidth = availWidth - 20;
      availHeight = pageHeight - 20;
      }
   else if (screen.height <= 600) {
      pageWidth = viewWidth;
      pageHeight = viewHeight - 52;
      if (chapterID == 0) pageHeight = pageHeight - 60;
      availWidth = pageWidth - 120;
      availHeight = pageHeight - 60;
     }/*
   else if (kindle) { // 2017/5/28
      pageWidth = viewWidth;
      pageHeight = viewHeight - 60;
      if (chapterID == 0) pageHeight -= 20;
      availWidth = pageWidth - 80;
      availHeight = pageHeight - 80;
	  if (pageHeight >= 800) {
         pageHeight -= 80;
		 if (chapterID == 0) pageHeight += 80;
         availHeight -= 80;
	     }
      }/*
   else if (iPad && (screen.height >= 800)) {
      pageWidth = viewWidth;
      pageHeight = viewHeight - 160;
      if (chapterID == 0) pageHeight += 20;
      availWidth = pageWidth - 120;
      availHeight = pageHeight - 80;
	  alert(pageHeight);
	  if (pageHeight >= 700) {
         pageHeight -= 80;
		 if (chapterID == 0) pageHeight -= 100;
         availHeight -= 80;
	     }
      }
   else {
      pageWidth = viewWidth;
      pageHeight = viewHeight - 52;
      if (chapterID == 0) pageHeight -= 40;
      availWidth = pageWidth - 120;
      availHeight = pageHeight - 60;
      }*/
    
   fontSize = GetCookie("FontSize");
   if (fontSize == null) {
      fontSize = 20;
      }
   else fontSize = parseInt(fontSize);
   textHeight = fontSize + 2; // 2017/5/29
//   if (iPad || iphone || Mac) textHeight += 4;

   fontName = GetCookie("FontName");

   if (fontName == null) {
      if (iPad || iphone || Mac) {
		 fontName = "黑體";
	     }
	  else fontName = "華康中黑體";
	  }
   else {
      if (iPad || iphone || Mac) {
	     if (fontName == "Heiti TC") {
			fontName = "黑體";
		    }
		 }
      }

   bgColor = GetCookie("BgColor");
   if (bgColor == null) bgColor = "#FFFFFF";

   colWidth = fontSize + 10;
   rowHeight = fontSize + 2;
   cols = Math.floor(availWidth/colWidth);
   rows = Math.floor(availHeight/rowHeight);

   }

function InitLayout() {
var viewArea = null;
var bookPage = '';
var footer = '';
var adjustHeight = pageHeight;

   if (chapterID == 0) {
      footer = "<tr><td>"
         + "<table id=F bgcolor=#0088AA height=40 width=" + pageWidth
         + " border=0 cellpadding=0 cellspacing=0><tr>"
         + "<td id=B onclick=RenderNextPage()>下一頁</td>"
         + "<td id=B onclick=OpenSettings()>設定</td>"
		 + "<td id=B onclick=ReturnToBookPage()>返回</td>"
         + "<td id=B onclick=OpenBookShelf()>書櫃</td>"
         + "<td id=B onclick=RenderPrevPage()>上一頁</td>"
         + "</tr></table></td></tr>";
      }

   bookPage = "<table height=" + viewHeight
      + " width=" + pageWidth + " border=0 cellpadding=0 cellspacing=0>"
      + "<tr id=CB><td id=C></td></tr>"
      + "<tr><td onclick=C(event) id=Viewer height=" + adjustHeight
      + "></td></tr>"
      + "<tr id=PB><td id=P></td></tr>"
      + footer
      + "</table>";

   layout = "<table align=center width=" + viewWidth + " height=" + viewHeight
      + " border=0 cellspacing=0 cellpadding=0>"
      + "<tr valign=top><td valign=top>"
      + bookPage
      + "</td></tr></table>";

   viewArea = document.getElementById("V");
   viewArea.innerHTML = layout;

   viewer = document.getElementById("Viewer");
   viewer.style.backgroundColor = bgColor;
   viewer.style.fontFamily = fontName;
   viewer.style.fontSize = fontSize + "px";

   chapterBar = document.getElementById("CB");
   pageBar = document.getElementById("PB");
   chapterBar.style.backgroundColor = bgColor;
   pageBar.style.backgroundColor = bgColor;

   pageStatus = document.getElementById("P");
   chapStatus = document.getElementById("C");

   InitContent();
   PaginateContent();
   GoToTargetPage();
   
//   confirm("Hello"); ///

   viewArea.style.visibility = "visible";
//   if (iphone) { HideIPhoneAddressBar();

   }

function InitContent() {

   sourceText = document.getElementById("SourceText").innerHTML;
   // Fix a strange problem with IE (only) where /r character remains.
   if (ie4) { sourceText = sourceText.replace(/\r/g, ""); }
//   sourceTextLen = sourceText.length;
   fourByteUnicode = (sourceText.search("丮") > 0); // To fix length() not
                             //recognizing 4-byte unicode
							 
//   if (fourByteUnicode) alert("Hello");
   paras = sourceText.split(BREAK);

   }

function PaginateContent() {

   var sumCols = 0;
   pagePointers = new Array();
   pagePointers[0] = [0, 0]; // [paragraph pointer, column pointer]
   for (var i=0; i<paras.length; i++) {
      var paraLen = paras[i].length;
	  if (fourByteUnicode) {
		 s = paras[i].match(/丮/g);
		 if (s != null) {
			n = s.length;
            paraLen -= (n + n);
			//alert(n);
	        }
	     }
      var paraCol = (paraLen==0 ? 1 : Math.ceil(paraLen/rows));
      sumCols += paraCol;
      while (sumCols > cols) {
         sumCols -= cols;
         pagePointers[pagePointers.length] = [i, paraCol-sumCols]; // [paragraph pointer, column pointer]
         }
      }

   }

function GoToTargetPage() {

   if (showLastPage) {
      RenderLastPage();   // When flipping to the previous chapter.
      return;
      }
   else	{
	    var cookie = GetCookie("ReadingPoint");
	    if (cookie != null)
	    {
	        // cookie format: bookID,chapterID,readingParaID,readingCharPosInPara,readTime
	        var ids = cookie.split(",");
	        var cookieBookID = ids[0];
	        var cookieChapterID = parseInt(ids[1]);
	        var readTime = parseInt(ids[4]);
	        var nowTime = (new Date()).getTime();
	        var ONE_HOUR = 1000*60*60;  // in milliseconds.
	        
	        // Only use the cookie value when it has been more than one hour
	        // since the last reading. That means the cookie value will not affect
	        // the normal page flipping when the user is actively reading.
	        if (cookieBookID == bookID && (nowTime-readTime) > ONE_HOUR)
	        {
	             if (cookieChapterID != chapterID)
	             {
	                 var restore = confirm("您曾經看過這本書。\n要回到上次的閱讀點嗎？");
	                 if (restore)
	                 {
	                    GoToChapter(cookieChapterID, false);
	                    return;
	                 }
	             }
	             else
	             {
	                 // The same chapter. Jump to the reading point directly.
	                 var cookieParaID = parseInt(ids[2]);
	                 var cookieCharPosInPara = parseInt(ids[3]);
	                 readingPoint = [cookieParaID, cookieCharPosInPara];
                     GoToReadingPage();
                     return;
	             }
	        }
	    }
	}

    // For all other cases, render the first page.
    RenderFirstPage();
}

function GoToReadingPage() {

  // Get the current reading point.
   var readingParaID = readingPoint[0];
   var readingCharPosInPara = readingPoint[1];
    
   // Determine the page that contains the reading point.
   for (var i=0; i<pagePointers.length; i++) {
      var paraID = pagePointers[i][0];
      var columnInPara = pagePointers[i][1];
      var charPosInPara = rows * columnInPara;
      if ((paraID == readingParaID && charPosInPara > readingCharPosInPara) 
         || paraID > readingParaID) { break; }
      }

   curPageIdx = i - 1;
   DisplayPage(curPageIdx);
   
   }

function GetPageContent(idx) {

 // Create an array of columns.
   var matrix = new Array(cols);
   for (var i=0; i<cols; i++) 	{
    // Create an array of rows.
      matrix[i] = new Array(rows);
      }
	
  // Reset the coordinates to right-upper corner.
   curColIdx = cols - 1;
   curRowIdx = 0;
   var isIndexMoved = true;
	
  // Locate the paragraph and column index of the starting character.
   var curParaIdx = pagePointers[idx][0];
   var curParaColIdx = pagePointers[idx][1];
   var curParaCharPos = rows * curParaColIdx;
   var para = paras[curParaIdx];
   var paraLen = para.length;
   
   var checkFourByteChar = false;
   if (fourByteUnicode) {
	  m = para.match(/丮/g);
	  checkFourByteChar = (m != null);
      }
	
  // Fill the array with page content.
   do {
		//Record position instead of the actual charater.
      matrix[curColIdx][curRowIdx] = (curParaCharPos < paraLen ? [curParaIdx, curParaCharPos] : null);

	  if (checkFourByteChar) {
		 if (curParaCharPos < paraLen) {
			cC = paras[curParaIdx].charAt(curParaCharPos);
		    if (cC == "丮") {
			   //alert("Hello");
			   curParaCharPos += 2;
	           }
	        }
	     }
      curParaCharPos++;
      if (curParaCharPos < paraLen) {
         isIndexMoved = MoveToNextElement();
         }
      else {
         curParaIdx++;
         if (curParaIdx < paras.length) {
            para = paras[curParaIdx];
            paraLen = para.length;
            curParaCharPos = 0;
            if (fourByteUnicode) {
               m = para.match(/丮/g);
               checkFourByteChar = (m != null);
               //if (checkFourByteChar) alert(checkFourByteChar);
               }			
			}
         isIndexMoved = MoveToNextColumn();
         }
	}
   while (isIndexMoved)
	
   return matrix;

   }

function MoveToNextElement() {

   if (curRowIdx < rows-1) 	{
      curRowIdx++;
	  return true;
	  }

   // already at the end of the current column.
   if (curColIdx > 0) {
      curColIdx--;
      curRowIdx = 0;
      return true;
      }

   // already at the last column.
   return false;
	
   }

function MoveToNextColumn() {

   if (curColIdx > 0) {
      curColIdx--;
      curRowIdx = indent;
	  return true;
      }
// already at the last column.
   return false;
	  
   }

function A(cell) {

//   var value = cell.firstChild.nodeValue;
//   alert(value);

   }

function TogglePageStatus() {

   if (hidePageStatus) {
      pageStatus.innerHTML = (curPageIdx+1) + " / " + pagePointers.length;
      hidePageStatus = false;
      }
   else {
      pageStatus.innerHTML = "&nbsp;";
      hidePageStatus = true;
      }

   }

function ToggleChapterStatus() {

   if (chapterID == 0) return;
   if (hideChapStatus) {
      chapStatus.innerHTML = chapterID + " / " + maxChapterID;
      hideChapStatus = false;
      }
   else {
      chapStatus.innerHTML = "&nbsp;";
      hideChapStatus = true;
      }

   }

function C(e) {

   if (chapterID == 0) return;

   var x1 = viewWidth / 3;
   var x2 = x1 + x1;
   var y0 = viewHeight /2;
   var y1 = viewHeight /3;
   var y2 = y1 + y1;
   if (!e) var e = window.event;

   var x = e.clientX;
   var y = e.clientY;
   if (x < x1) {
      if (y < y0) NextChapter();
      else RenderNextPage();
      return;
      }
   if (x < x2) {
      if (y < y1) ToggleChapterStatus();
      else if (y < y2) GoToChapter(0);
      else TogglePageStatus();
      return;
      }
   if (y < y0) PrevChapter(); 
   else RenderPrevPage();

   }

function GeneratePageHtml(matrix) {

// Use table[l] to speed up string concatenation.
   var table = [];
   var l = 0;

   table[l++] = "<table align=center id='ViewerTable' border='0' cellspacing='0' cellpadding='0' " + "style='width: " + (colWidth*cols) + "px; height: " + (rowHeight*rows) + "px; " + "font-size: " + fontSize + "px;" + (bgColor == "" ? "" : ("background-color: " + bgColor + ";")) + "'>";

   for (var rowIdx=0; rowIdx < rows; rowIdx++) {
      table[l++] = "<tr>";
      for (var colIdx=0; colIdx<cols; colIdx++)	{
         var pos = matrix[colIdx][rowIdx];
         if (pos == null) {
		   cC = "　"; // 2017/7/28
		   table[l++] = "<td><div style='font-size:" + textHeight + "px; height:" + fontSize +"px; width:" + fontSize +"px;'>" + cC + "</div></td>";
            }
         else {
// pos[0] is the paragraph ID, pos[1] is the character position in that paragraph.
//            table[l++] = "<td onclick=A(this)>" + paras[pos[0]].charAt(pos[1]) + "</td>";
            cC = paras[pos[0]].charAt(pos[1]);
			if (fourByteUnicode) {
				if (cC == "丮") {
					cC = paras[pos[0]].charAt(pos[1]+1) + paras[pos[0]].      charAt(pos[1]+2);
				   }				
			    }			
            table[l++] = "<td><div style='font-size:" + textHeight + "px; height:" + fontSize +"px;'>" + cC + "</div></td>";
            }
         }
      table[l++] = "</tr>";
      }

   table[l++] = "</table>";
   return table.join("");

   }

function GenerateTocHtml(matrix) {

   // Use table[l] to speed up string concatenation.
   var table = [];
   var l = 0;
   var click = "";
	
   table[l++] = "<table align=center id='ViewerTable' border='0' cellspacing='0' cellpadding='0' "
      + "style='width: " + (colWidth*cols) + "px; height: " + (rowHeight*rows) + "px; " + "font-size: " + fontSize + "px;" +  "'>";

   for (var rowIdx=0; rowIdx<rows; rowIdx++) {
      table[l++] = "<tr>";
      for (var colIdx=0; colIdx<cols; colIdx++) {
         var pos = matrix[colIdx][rowIdx];
	// Here we use paragraph ID to navigate to chapter.
	// Note that chapter #0 is the TOC. Paragraph #0 should link to chapter #1.
    // If pos is null (for blanks), just use the first character of the column for reference.
         var posRef = (pos != null ? pos : matrix[colIdx][0]);
         if (posRef != null) { click = "GoToChapter(" + (posRef[0]+1) + ", false)"; }
         if (pos == null) {
			cC = "　"; // 2017/7/28
            table[l++] = "<td onclick='" + click + "'><div style='font-size:" + textHeight + "px; height:" + fontSize +"px; width:" + fontSize +"px;'>" + cC + "</div></td>";
            }
         else {
			cC = paras[pos[0]].charAt(pos[1]);
			if (fourByteUnicode) {
				if (cC == "丮") {
					cC = paras[pos[0]].charAt(pos[1]+1) + paras[pos[0]].      charAt(pos[1]+2);
				   }				
			    }
			table[l++] = "<td onclick='" + click + "' class='Char'" +  ">" + "<div style='font-size:" + textHeight + "px; height:" + fontSize +"px;'>" + cC + "</div></td>";
            }
		 }
      table[l++] = "</tr>";
	  }

   table[l++] = "</table>";
   return table.join("");
    
   }

function DisplayPage(idx) {

//   alert("Show Page");
//   alert(navigator.userAgent);

   viewer.innerHTML = (chapterID == 0 ? GenerateTocHtml(GetPageContent(idx)) :
      GeneratePageHtml(GetPageContent(idx)));

   if (!hidePageStatus) pageStatus.innerHTML = (idx+1) + " / " + pagePointers.length;
   if (chapterID == 0) {
      hideChapStatus = false;
      chapStatus.innerHTML = "目錄";
      }
   else if (!hideChapStatus) chapStatus.innerHTML = chapterID + " / " + maxChapterID;
	
	// Record the reading point in memory.
	var readingParaID = pagePointers[idx][0];
	var readingColumnInPara = pagePointers[idx][1];
	var readingCharPosInPara = rows * readingColumnInPara;
	readingPoint = [readingParaID, readingCharPosInPara];
	
	// Also record it in cookie.
	// cookie format: bookID,chapterID,readingParaID,readingCharPosInPara,readTime
	var cookie = bookID + "," + chapterID + "," + readingParaID + "," + 
	    readingCharPosInPara + "," + ((new Date()).getTime());
	SetCookie("ReadingPoint", cookie, DefaultExpireDate());

   }

function RenderNextPage() {

   if (curPageIdx < pagePointers.length-1) {
      curPageIdx++;
      DisplayPage(curPageIdx);
      }
   else	{
      GoToNextChapter();
      }
   }

function RenderPrevPage() {

   if (curPageIdx > 0) {
      curPageIdx--;
      DisplayPage(curPageIdx);
      }
   else	{
      var goToLastPage = true;
      GoToPrevChapter(goToLastPage);
      }

   }

function RenderFirstPage() {

   curPageIdx = 0;
   DisplayPage(curPageIdx);

   }

function RenderLastPage() {

   curPageIdx = pagePointers.length - 1;
   DisplayPage(curPageIdx);

   }

function GetQueryStringParam(name) {

   var start = location.search.indexOf("?" + name + "=");
   if (start < 0) { start = location.search.indexOf("&" + name + "="); }
   if (start < 0) { return ''; }
   start += name.length+2;
   var end = location.search.indexOf("&",start) - 1;
   if (end < 0) { end = location.search.length; }
   var result = '';
   for (var i=start; i<=end; i++) {
	  var c = location.search.charAt(i);
	  result = result + (c == '+' ? ' ' : c);
	  }
   return unescape(result);

   }

function HandleKey(e) {

   switch (e.keyCode) {
      case 33:	// PageUp
		 GoToPrevChapter();
		 break;
      case 34:	// PageDown
		 GoToNextChapter();
	    break;
      case 38:	// ArrowUp
      case 39:	// ArrowRight
         RenderPrevPage();
         break;
      case 32:    // Space	
      case 37:	// ArrowLeft
      case 40:	// ArrowDown
         RenderNextPage();
         break;
      case 36:	// Home
         RenderFirstPage();
         break;
      case 35:	// End
         RenderLastPage();
         break;
	  }
   }

function PrevChapter() {

   if (0 < curPageIdx) RenderFirstPage();
   else GoToPrevChapter();

   }

function NextChapter() {

   if (0 < curPageIdx && curPageIdx < pagePointers.length-1)
      RenderLastPage();
   else GoToNextChapter();

   }

function GoToPrevChapter(goToLastPage) {

   if (chapterID > 0) GoToChapter(chapterID - 1, goToLastPage);

   }

function GoToNextChapter() {

   if (chapterID < maxChapterID) GoToChapter(chapterID + 1, false);

   }

function GoToChapter(chapID, goToLastPage) {

   OpenLoadingBar();
   location.href = location.pathname + 
      "?M=" + module +
      "&P=" + bookID + chapID +
      "&L=" + linkModule +
      (goToLastPage ? "&F=-1" : "");

   }


function OpenBookShelf() {
    
   var bookShelf = document.getElementById("BookShelf");
   var shelfWidth = bookShelf.offsetWidth ? bookShelf.offsetWidth : 
        bookShelf.style.width ? parseInt(bookShelf.style.width) : 0;
   var shelfHeight = bookShelf.offsetHeight ? bookShelf.offsetHeight : 
        bookShelf.style.height ? parseInt(bookShelf.style.height) : 0;
   var setX = (GetViewportWidth() + colWidth*cols)/2 - shelfWidth;
   var setY = viewHeight - shelfHeight;// - 10;
   if (setX < 0) { setX = 0; }
   if (setY < 0) { setY = 0; }
   bookShelf.style.left = setX + "px";
   bookShelf.style.top = setY + "px";
   bookShelf.style.visibility = "visible";

   }

function CloseBookShelf() {
   var bookShelf = document.getElementById("BookShelf");
   bookShelf.style.visibility = "hidden";
   }

function OpenSettings() {

   var settings = document.getElementById("Settings");
   var settingsWidth = settings.offsetWidth ? settings.offsetWidth : 
       settings.style.width ? parseInt(settings.style.width) : 0;
   var settingsHeight = settings.offsetHeight ? settings.offsetHeight : 
       settings.style.height ? parseInt(settings.style.height) : 0;
   var setX = (GetViewportWidth() - colWidth*cols)/2;
   var setY = viewHeight - settingsHeight - 10;
   if (setX < 0) { setX = 0; }
   if (setY < 0) { setY = 0; }
   settings.style.left = setX + "px";
   settings.style.top = setY + "px";
    
    // Load the user settings from cookie and populate the input controls.
//    var w = GetCookie("Width");
//    var h = GetCookie("Height");
   var fs = GetCookie("FontSize");
   var fn = GetCookie("FontName");    
   var bc = GetCookie("BgColor");    
//    document.getElementById("Width").value = (w==null ? "" : w);
//    document.getElementById("Height").value = (h==null ? "" : h);
   document.getElementById("FontSize").value = (fs==null ? fontSize : fs);
   document.getElementById("FontName").value = (fn==null ? fontName : fn);
   document.getElementById("BgColor").value = (bc==null ? "" : bc);

   document.getElementById("FontSize").value = fontSize;
   document.getElementById("FontName").value = fontName;

   HighlightFontSizePicker();
   HighlightColorPicker(bc);

   settings.style.visibility = "visible";

   }

function HighlightFontSizePicker() {

   var s = (fontSize - 16) / 4;
   for (var i=0; i<10; i++) {
      var ctrl = document.getElementById("Size"+i);
      if (i == s) ctrl.style.border = "2px solid black";
         else ctrl.style.border = "1px solid #AAAAAA";
      }
   
   }

function SelectFontSize(selectedCtrl) {

   for (var i=0; i<10; i++) {
      var ctrl = document.getElementById("Size"+i);
      if (ctrl != selectedCtrl) ctrl.style.border = "1px solid #AAAAAA";
      else {
         ctrl.style.border = "2px solid black";
         fontSize = i * 4 + 16;
         }
      }

   }

function HighlightColorPicker(bc) {

   for (var i=0; i<5; i++) {
      var ctrl = document.getElementById("Color"+i);
      if (ctrl.style.backgroundColor == bc)
         ctrl.style.border = "2px solid black";
      else ctrl.style.border = "1px solid #AAAAAA";
      }
   
   }
   
function OpenBookShelf() {
   var bookShelf = document.getElementById("BookShelf");
   var shelfWidth = bookShelf.offsetWidth ? bookShelf.offsetWidth : 
       bookShelf.style.width ? parseInt(bookShelf.style.width) : 0;
   var shelfHeight = bookShelf.offsetHeight ? bookShelf.offsetHeight : 
       bookShelf.style.height ? parseInt(bookShelf.style.height) : 0;
   var setX = (GetViewportWidth() + colWidth*cols)/2 - shelfWidth;
   var setY = viewHeight - shelfHeight - 10;
   if (setX < 0) { setX = 0; }
   if (setY < 0) { setY = 0; }
   bookShelf.style.left = setX + "px";
   bookShelf.style.top = setY + "px";
   bookShelf.style.visibility = "visible";
   }

function CloseBookShelf() {
   var bookShelf = document.getElementById("BookShelf");
   bookShelf.style.visibility = "hidden";
   }

function SelectBgColor(selectedCtrl) {

   for (var i=0; i<5; i++)
       document.getElementById("Color"+i).style.border = "1px solid #AAAAAA";
   document.getElementById("BgColor").value = selectedCtrl.style.backgroundColor;
   selectedCtrl.style.border = "2px solid black";

   }

function CloseSettings() {
    var settings = document.getElementById("Settings");
    settings.style.visibility = "hidden";
   }

function ApplySettings() {

   var fontName = document.getElementById("FontName").value;
   var bgColor = document.getElementById("BgColor").value;

   SetCookie("FontSize", fontSize, DefaultExpireDate());
   SetCookie("FontName", fontName, DefaultExpireDate());
   SetCookie("BgColor", bgColor, DefaultExpireDate());
   CloseSettings();
    
   InitView();
   viewer.style.backgroundColor = bgColor;
   chapterBar.style.backgroundColor = bgColor;
   pageBar.style.backgroundColor = bgColor;
   PaginateContent();
   GoToReadingPage();
	if (iphone) { HideIPhoneAddressBar(); }

   }

function OpenLoadingBar() {
    var bar = document.getElementById("LoadingBar");
    var barWidth = bar.offsetWidth ? bar.offsetWidth : 
        bar.style.width ? parseInt(bar.style.width) : 0;
    var barHeight = bar.offsetHeight ? bar.offsetHeight : 
        bar.style.height ? parseInt(bar.style.height) : 0;
    var setX = (GetViewportWidth() - barWidth)/2 ;
    var setY = (viewHeight - barHeight)/2;
    bar.style.left = setX + "px";
    bar.style.top = setY + "px";
    bar.style.visibility = "visible";
   }

function ReturnToBookPage() {

//   alert(location.href);
   location.href = location.pathname + 
      "?M=" + linkModule +
      "&P=" + linkPage;

   }
   
