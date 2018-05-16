var web0 = "?M=m&P=";
var web1 = "?M=u&P=";
var web2 = "?M=d&P=";
var web3 = "?M=h&P=";
var web4 = "?M=j&P=";
var web5 = "?M=a&P=";
var web6 = "?M=w&P=";

function ToggleMenu(name, id) {
   var ele = document.getElementById(name + id);
   var imageEle = document.getElementById(name + id + "switch");
   if (ele.style.display == "block") {
      ele.style.display = "none";
      imageEle.innerHTML = '<img src="image/plus.png" border="0">';
	  DeleteCookie(name);
      }
   else {
      ele.style.display = "block";
      imageEle.innerHTML = '<img src="image/minus.png" border="0">';
      SetCookie(name, id, DefaultExpireDate());
      }
   } 

function SetMenu(name) {
   id = GetCookie(name);
   if (id == null) return;
   var ele = document.getElementById(name + id);
   if (ele == null) return;
   var imageEle = document.getElementById(name + id + "switch");
   if (imageEle == null) return;
   ele.style.display = "block";
   imageEle.innerHTML = '<img src="image/minus.png" border="0">';
   }

function ReadPdbOnline($book) {
   var answer = confirm("線上閱讀？");
   if (answer) {
      var loc = window.location;
      $read = loc.protocol + "//" + loc.host + loc.pathname + web0 + $book + ":0";
      window.location = $read;
      }
   }


function Confirm(question, callback) {
   var confirmModal = 
      $('<div class="modal fade">' +        
          '<div class="modal-dialog modal-sm">' +
          '<div class="modal-content">' +

          '<div class="modal-body">' +
            '<p>' + question + '</p>' +
          '</div>' +

          '<div class="modal-footer">' +
            '<a href="#!" id="okButton" class="btn btn-primary sharp">確定</a>' +
            '<a href="#!" class="btn" data-dismiss="modal">取消</a>' +
          '</div></div></div></div>');

   confirmModal.find('#okButton').click(function(event) {
      callback();
      confirmModal.modal('hide');
    }); 

   confirmModal.modal('show');
   }

function ReadOnline($book, $module) {
   var callback = function() {
      var loc = window.location;
      $read = loc.protocol + "//" + loc.host + loc.pathname + web1 +   $book + ":0" + "&L=" + $module;
      window.location = $read;
      };	
   Confirm('線上閱讀？', callback);
   }

function DownloadUpdb($book) {
   var msg = '下載好讀 ' + $book.substring(1) + '.updb？ (Unicode 碼)';
   var callback = function() {
      var loc = window.location;
      $download = loc.protocol + "//" + loc.host + loc.pathname + web2 + $book + ".updb";
      window.location = $download;
      };	
   Confirm(msg, callback);
   }

function DownloadPdb($book) {
   var callback = function() {
      var loc = window.location;
      $download = loc.protocol + "//" + loc.host + loc.pathname + web2 + $book + ".pdb";
      window.location = $download;
      };	
   Confirm('下載好讀 pdb 檔？ (Big5 碼)', callback);
   }
   
function DownloadPdf($book) {
   var answer = confirm("下載 pdf 檔？(zip檔)\r\n");
   if (answer) {
      var loc = window.location;
      $download = loc.protocol + "//" + loc.host + loc.pathname + web2 + $book + ".zip";
      window.location = $download;
      }
   }

function DownloadPrc($book) {
   var msg = '下載 ' + $book.substring(1) + '.prc？ (適用於Kindle，及能開啟mobi檔的閱讀軟體)';
   var callback = function() {
      var loc = window.location;
      $download = loc.protocol + "//" + loc.host + loc.pathname + web2 + $book + ".prc";
      window.location = $download;
      };	
   Confirm(msg, callback);
   }
   
function DownloadMobi($book) {
   var msg = '下載直式 ' + $book.substring(1) + '.mobi？ (適用於Kindle Paperwhite, Voyage)';
   var callback = function() {
      var loc = window.location;
      $download = loc.protocol + "//" + loc.host + loc.pathname + web2 + $book + ".mobi";
      window.location = $download;
      };	
   Confirm(msg, callback);
   }

function DownloadEpub($book) {
   var msg = '下載 ' + $book.substring(1) + '.epub？';
   var callback = function() {
      var loc = window.location;
      $download = loc.protocol + "//" + loc.host + loc.pathname + web2 + $book + ".epub";
      window.location = $download;
      };	
   Confirm(msg, callback);
   }

function DownloadVEpub($book) {
   var msg = '下載直式 ' + $book.substring(1) + '.epub？';
   var callback = function() {
      var loc = window.location;
      $download = loc.protocol + "//" + loc.host + loc.pathname + web2 + $book + ".epub";
      window.location = $download;
      };	
   Confirm(msg, callback);
   }

function DownloadMP3($mp3) {
   var answer = confirm("下載 mp3 檔？");
   if (answer) {
      var loc = window.location;
      $download = loc.protocol + "//" + loc.host + loc.pathname + web3 + $mp3 + ".mp3";
      window.location = $download;
      }
   }

function DownloadAudio($mp3) {
   var answer = confirm("下載 mp3 檔？");
   if (answer) {
      var loc = window.location;
      $download = loc.protocol + "//" + loc.host + loc.pathname + web5 + $mp3 + ".mp3";
      window.location = $download;
      }
   }

function DownloadAudioHwarong($mp3) {
   var answer = confirm("下載 mp3 檔？");
   if (answer) {
      var loc = window.location;
      $download = loc.protocol + "//" + loc.host + loc.pathname + web6 + $mp3 + ".mp3";
      window.location = $download;
      }
   }

function DownloadJPG($jpg) {
   var answer = confirm("下載 jpg 檔？");
   if (answer) {
      var loc = window.location;
      $download = loc.protocol + "//" + loc.host + loc.pathname + web4 + $jpg;
      window.location = $download;
      }
   }

function ChangeTopRow($c1, $c2, $c3) {
   $m1 = '<table class="m10" width="510" border="0" cellpadding="0" cellspacing="0" background="images/bgfadegreen.gif"><tr><td><img src="images/subject-mbook.gif" align=left></td><td>';
   $m2 = '</td><td>';
   $m3 = '</td></tr></table>';
   var t = document.getElementById("t");
   t.innerHTML = $m1 + $c1 + $m2 + $c2 + $m2 + $c3 + $m3;
   }

function SetTopLinks($c1, $c2, $c3) {
   $m1 = '<table class="m10" width="510" border="0" cellpadding="0" cellspacing="0" background="images/bgfadegreen.gif"><tr><td><img src="images/subject-mbook.gif" align=left></td><td align="left">';
   $m2 = '</td><td align="center">';
   $m3 = '</td><td align="right">';
   $m4 = '</td></tr></table>';
   var t = document.getElementById("t");
   t.innerHTML = $m1 + $c1 + $m2 + $c2 + $m3 + $c3 + $m4;
   }

function SetBottomLinks($c1, $c2, $c3) {
   $m1 = '<table class="m10" width="510" border="0" cellpadding="0" cellspacing="0"><tr><td width="33%" align="left" valign="top">';
   $m2 = '</td><td width="34%" align="center" valign="top">';
   $m3 = '</td><td width="33%" align="right" valign="top">';
   $m4 = '</td></tr></table>';
   var t = document.getElementById("b");
   t.innerHTML = $m1 + $c1 + $m2 + $c2 + $m3 + $c3 + $m4;
   }

function SetLinks($c1, $c2, $c3) {

   SetTopLinks($c1, $c2, $c3);
   SetBottomLinks($c1, $c2, $c3);

   }

function SetTitle($title) {

   document.title = $title + '- 好讀';

   }

function SetPageTitle($title) {

   document.title = $title + '- 好讀';
   $m1 = '<table class="m10" width="510" border="0" cellpadding="0" cellspacing="0" background="images/bgfadegreen.gif"><tr><td><img src="images/subject-mbook.gif" align=left></td><td align=left><font color="CC3300">';
   $m2 = '</font></td></table>';
   var t = document.getElementById("t");
   t.innerHTML = $m1 + $title + $m2;

   }

function SetLink($link) {

   $m1 = '<table class="m10" width="510" border="0" cellpadding="0" cellspacing="0" background="images/bgfadegreen.gif"><tr><td><img src="images/subject-mbook.gif" align=left></td><td>';
   $m2 = '</td></tr></table>';
   var t = document.getElementById("t");
   t.innerHTML = $m1 + $link + $m2;

   }

function SetTopNavigation($c1, $c2, $c3) {
   $m1 = '<table class="m10" width="510" border="0" cellpadding="0" cellspacing="0" background="images/bgfadegreen.gif"><tr><td><img src="images/subject-mbook.gif" align=left></td><td align="left">';
   $m2 = '</td><td align="center"><font color="CC3300">';
   $m3 = '</font></td><td align="right">';
   $m4 = '</td></tr></table>';
   var t = document.getElementById("t");
   t.innerHTML = $m1 + $c1 + $m2 + $c2 + $m2 + $c3 + $m4;
   }

function SetBottomNavigation($c1, $c2, $c3) {
   $m1 = '<table class="m10" width="510" border="0" cellpadding="0" cellspacing="0"><tr><td width="33%" align="left" valign="top">';
   $m2 = '</td><td width="34%" align="center" valign="top"><font color="CC3300">';
   $m3 = '</font></td><td width="33%" align="right" valign="top">';
   $m4 = '</td></tr></table>';
   var t = document.getElementById("b2");
   t.innerHTML = $m1 + $c1 + $m2 + $c2 + $m3 + $c3 + $m4;
   }

function SetNavigation($c1, $c2, $c3) {

   document.title = $c2;
   SetTopNavigation($c1, $c2, $c3);

   var t = document.getElementById("b1");
   t.innerHTML = '<br>';

   SetBottomNavigation($c1, $c2, $c3);

   }


function SetHHDNavigation($mp3, $size, $c1, $c2, $c3) {

   document.title = '黃河《' + $c2 + '》- 黃河渡';
   SetTopNavigation($c1, $c2, $c3);

   if ($mp3 != '') {
      var t = document.getElementById("a");
      if  (t != '') {
          t.innerHTML = '<audio controls><source src="hhd/MP3/' + $mp3
          + '.mp3" type="audio/mpeg"></audio>';
          }
     }

   var t = document.getElementById("b1");
   t.innerHTML = '<br><font size=2>寫信給黃河：<a href="?M=hhd&P=contact">請按這裡</a>。</font>';
   SetBottomNavigation($c1, $c2, $c3);

   }


function SetHHDBookNavigation($c1, $c2, $c3) {

   $t = $c2.replace(/<br>/i, '');
   document.title = '黃河《' + $t + '》- 黃河渡';
   SetTopNavigation($c1, $c2, $c3);

   var t = document.getElementById("b1");
   t.innerHTML = '<br><font size=2>寫信給黃河：<a href="?M=hhd&P=contact">請按這裡</a>。</font>';
   SetBottomNavigation($c1, $c2, $c3);

   }


function SetJiannNavigation($c1, $c2, $c3) {

   document.title = '周劍輝《' + $c2 + '》- 好讀';
   SetTopNavigation($c1, $c2, $c3);

   var t = document.getElementById("b1");
   t.innerHTML = '<br><font size=2>寫信給周劍輝：<a href="?M=mail&P=jiann">請按這裡</a>。</font>';
   SetBottomNavigation($c1, $c2, $c3);

   }


function SetLuiNavigation($c1, $c2, $c3) {

   $t = $c2.replace(/<br>/i, '');
   document.title = '雷洵《' + $t + '》- 好讀';
   SetTopNavigation($c1, $c2, $c3);

   var t = document.getElementById("b1");
   t.innerHTML = '<br><font size=2>寫信給雷洵：<a href="?M=lui&P=contact">請按這裡</a>。</font>';
   SetBottomNavigation($c1, $c2, $c3);

   }


function SetHJNavigation($c1, $c2, $c3) {

   document.title = '秋陽《' + $c2 + '》- 好讀';
   SetTopNavigation($c1, $c2, $c3);

   var t = document.getElementById("b1");
   t.innerHTML = '<br><font size=2>寫信給秋陽：<a href="?M=hj&P=contact">請按這裡</a>。</font>';
   SetBottomNavigation($c1, $c2, $c3);

   }


function SetYulinNavigation($c1, $c2, $c3) {

   document.title = '游喻琳《' + $c2 + '》- 好讀';
   SetTopNavigation($c1, $c2, $c3);

   var t = document.getElementById("b1");
   t.innerHTML = '<br><font size=2>寫信給游喻琳：<a href="?M=yulin&P=contact">請按這裡</a>。</font>';
   SetBottomNavigation($c1, $c2, $c3);

   }

function SetFochNavigation($c1, $c2, $c3) {

   $t = $c2.replace(/<br>/i, '');
   document.title = '伏羲氏《' + $t + '》- 好讀';
   SetTopNavigation($c1, $c2, $c3);

   var t = document.getElementById("b1");
   t.innerHTML = '<br><font size=2>寫信給伏羲氏：<a href="?M=foch&P=contact">請按這裡</a>。</font>';

   SetBottomNavigation($c1, $c2, $c3);

   }

function SetKenNavigation($c1, $c2, $c3) {

   document.title = '趙之楚《' + $c2 + '》- 好讀';
   SetTopNavigation($c1, $c2, $c3);

   var t = document.getElementById("b1");
   t.innerHTML = '<br><font size=2>寫信給趙之楚：<a href="?M=ken&P=contact">請按這裡</a>。</font>';

   SetBottomNavigation($c1, $c2, $c3);

   }

function SetLiaoNavigation($c1, $c2, $c3) {

   document.title = '廖玉燕《' + $c2 + '》- 好讀';
   SetTopNavigation($c1, $c2, $c3);

   var t = document.getElementById("b1");
   t.innerHTML = '<br><font size=2>寫信給廖玉燕：<a href="?M=liao&P=contact">請按這裡</a>。</font>';

   SetBottomNavigation($c1, $c2, $c3);

   }
   
function SetMarinaNavigation($c1, $c2, $c3) {

   document.title = '林滿足《' + $c2 + '》- 好讀';
   SetTopNavigation($c1, $c2, $c3);

   var t = document.getElementById("b1");
   t.innerHTML = '<br><font size=2>寫信給林滿足：<a href="?M=marina&P=contact">請按這裡</a>。</font>';

   SetBottomNavigation($c1, $c2, $c3);

   }

function SetHwarongNavigation($c1, $c2, $c3) {

   document.title = '王華容《' + $c2 + '》- 好讀';
   SetTopNavigation($c1, $c2, $c3);

   var t = document.getElementById("b1");
   t.innerHTML = '<br><font size=2>寫信給王華容：<a href="?M=hwarong&P=contact">請按這裡</a>。</font>';

   SetBottomNavigation($c1, $c2, $c3);

   }

function SetLongNavigation($c1, $c2, $c3) {

   document.title = '龍行者《' + $c2 + '》- 好讀';
   SetTopNavigation($c1, $c2, $c3);

   var t = document.getElementById("b1");
   t.innerHTML = '<br><font size=2>寫信給龍行者：<a href="?M=long&P=contact">請按這裡</a>。</font>';

   SetBottomNavigation($c1, $c2, $c3);

   }

function SetKuanNavigation($c1, $c2, $c3) {

   $t = $c2.replace(/<br>/i, '');
   document.title = '管建中《' + $t + '》- 好讀';
   SetTopNavigation($c1, $c2, $c3);

   var t = document.getElementById("b1");
   t.innerHTML = '<br><font size=2>寫信給管建中：<a href="?M=kuan&P=contact">請按這裡</a>。</font>';

   SetBottomNavigation($c1, $c2, $c3);

   }

function SetAnnaNavigation($c1, $c2, $c3) {

   document.title = '孟絲《' + $c2 + '》- 好讀';
   SetTopNavigation($c1, $c2, $c3);

   var t = document.getElementById("b1");
   t.innerHTML = '<br><font size=2>寫信給孟絲：<a href="?M=anna&P=contact">請按這裡</a>。</font>';

   SetBottomNavigation($c1, $c2, $c3);

   }

function SetFaymonNavigation($c1, $c2, $c3) {

   document.title = '牛哥《' + $c2 + '》- 好讀';
   SetTopNavigation($c1, $c2, $c3);

   var t = document.getElementById("b1");
   t.innerHTML = '<br>';

   SetBottomNavigation($c1, $c2, $c3);

   }

function SetFaymon1Navigation($c1, $c2, $c3) {

   document.title = '費蒙《' + $c2 + '》- 好讀';
   SetTopNavigation($c1, $c2, $c3);

   var t = document.getElementById("b1");
   t.innerHTML = '<br>';

   SetBottomNavigation($c1, $c2, $c3);

   }

function SetTingNavigation($c1, $c2, $c3) {

   document.title = '丁智原《' + $c2 + '》- 好讀';
   SetTopNavigation($c1, $c2, $c3);

   var t = document.getElementById("b1");
   t.innerHTML = '<br><font size=2>寫信給丁智原：<a href="?M=ting&P=contact">請按這裡</a>。</font>';

   SetBottomNavigation($c1, $c2, $c3);

   }

function SetGuruNavigation($c1, $c2, $c3) {

   $t = $c2.replace(/<br>/i, '');
   document.title = '薛中鼎《' + $t + '》- 好讀';
   SetTopNavigation($c1, $c2, $c3);

   var t = document.getElementById("b1");
   t.innerHTML = '<br><font size=2>寫信給薛中鼎：<a href="?M=guru&P=contact">請按這裡</a>。</font>';

   SetBottomNavigation($c1, $c2, $c3);

   }