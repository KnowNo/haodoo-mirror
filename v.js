// GetViewportWidth() and GetViewportHeight() can approximate iPhone size,
// but sometimes are off by a little bit. Use GetIPhoneWidth()
// and GetIPhoneHeight() for more accurate measurements.

function GetDefaultWidth() {
   return $(window).width();
	/*
    if (iphone)
    {
        return GetIPhoneWidth();
    }
    else
    {
        // For all other platforms. Can be enhanced.
        return GetViewportWidth();
    }
	*/
   }

function GetDefaultHeight()
{
	return $(window).height();
	/*
    if (iphone)
    {
        return GetIPhoneHeight();
    }
    else
    {
        // For all other platforms. Can be enhanced.
        return GetViewportHeight();
    }
	*/
}

function GetDefaultFontSize()
{
    if (iphone)
    {
        return 20;
    }
    else
    {
        // For all other platforms. Can be enhanced.
        if (width < 500)
        {
            return 20;
        }
        else
        {
            return 24;
        }
    }
}

function IsIPhonePortrait()
{
    return (window.orientation == undefined && window.innerWidth < 400)
        || (window.orientation == 0 || window.orientation == 180);
}

function GetIPhoneWidth()
{
    return (IsIPhonePortrait() ? 320 : 480);
}

function GetIPhoneHeight()
{
    return (IsIPhonePortrait() ? 420 : 275);
}

function OnViewportResized()
{
    //alert("resized");
    if (!iphone)
    {
        clearTimeout(window.ViewportHandle);
        var command = "ChangeViewport(" + GetViewportWidth() + ", " + GetViewportHeight() + ")";
        window.ViewportHandle = setTimeout(command, 300);
    }
}

function OnViewportRotated() {

//   alert("rotated");
    if (iphone && confirm("您的畫面旋轉了。\n您想根據畫面大小重新分頁嗎?"))
    {
        clearTimeout(window.ViewportHandle);
        var command = "ChangeViewport(" + GetIPhoneWidth() + ", " + GetIPhoneHeight() + ")";
        window.ViewportHandle = setTimeout(command, 300);
    }
   }

function ChangeViewport(w, h) {
    
   if (w != width || h != height) {
      InitView();
      InitLayout();
      PaginateContent();
      GoToReadingPage();
//      if (iphone) { HideIPhoneAddressBar(); }
      }

   }

function HideIPhoneAddressBar()
{
    setTimeout(function(){window.scrollTo(0, 1);}, 100);
}

function GetViewportWidth()
{
  var width = 0;
  if( document.documentElement && document.documentElement.clientWidth ) {
    width = document.documentElement.clientWidth;
  }
  else if( document.body && document.body.clientWidth ) {
    width = document.body.clientWidth;
  }
  else if( window.innerWidth ) {
    width = window.innerWidth - 18;
  }
  return width;
}

function GetViewportHeight()
{
  var height = 0;
  if( document.documentElement && document.documentElement.clientHeight ) {
    height = document.documentElement.clientHeight;
  }
  else if( document.body && document.body.clientHeight ) {
    height = document.body.clientHeight;
  }
  else if( window.innerHeight ) {
    height = window.innerHeight - 18;
  }
  return height;
}

function GetViewportScrollX()
{
  var scrollX = 0;
  if( document.documentElement && document.documentElement.scrollLeft ) {
    scrollX = document.documentElement.scrollLeft;
  }
  else if( document.body && document.body.scrollLeft ) {
    scrollX = document.body.scrollLeft;
  }
  else if( window.pageXOffset ) {
    scrollX = window.pageXOffset;
  }
  else if( window.scrollX ) {
    scrollX = window.scrollX;
  }
  return scrollX;
}

function GetViewportScrollY()
{
  var scrollY = 0;
  if( document.documentElement && document.documentElement.scrollTop ) {
    scrollY = document.documentElement.scrollTop;
  }
  else if( document.body && document.body.scrollTop ) {
    scrollY = document.body.scrollTop;
  }
  else if( window.pageYOffset ) {
    scrollY = window.pageYOffset;
  }
  else if( window.scrollY ) {
    scrollY = window.scrollY;
  }
  return scrollY;
}
