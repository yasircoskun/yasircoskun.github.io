// JQuery Font Select
// Purpose: To provide a font select box for the user to select a font
//          from all the fonts available on google fonts.
// Support custom font-size and color, background-color and text.
(function ( $ ) { 

var google_api_key = "AIzaSyBWKzENDmHXWYxjUX9fwekH0OR334TKZCk"
$(document).ready(function() {
  function next() {
    $('.previewText').fadeOut(100, function() {
      // change the font
      if($('#fontSelector option:selected').next()){
        $('#fontSelector').val($('#fontSelector option:selected').next().val());
      }else{
        $('#fontSelector').val($('#fontSelector option:first').val());
      }
      $('#fontSelector').change();
      // slow fade in the preview text
      setTimeout(function() {
        $('.previewText').fadeIn(100);
      }, 100);
    });
  }

  function prev() {
    $('.previewText').fadeOut(100, function() {
      // change the font
      if($('#fontSelector option:selected').prev()){
        $('#fontSelector').val($('#fontSelector option:selected').prev().val());
      }else{
        $('#fontSelector').val($('#fontSelector option:last').val());
      }
      $('#fontSelector').change();
      // slow fade in the preview text
      setTimeout(function() {
        $('.previewText').fadeIn(100);
      }, 100);
    });
  }

  function zoomOut() {
    $('.previewText').css('font-size', parseInt($('.previewText').css('font-size')) - 1);
  }

  function zoomIn() {
    $('.previewText').css('font-size', parseInt($('.previewText').css('font-size')) + 1);
  }

  function showControlOnMove(e) {
    $('#controls').fadeIn(100);
    clearTimeout(window.hideControls);
    window.hideControls = setTimeout(function() {
      $('#controls').fadeOut(100);
    }
    , 1337 / 5);
  }


  function getQuote() {
    $.ajax({
      url: './quotes.json',
      success: function(data) {
        let quotes = data.quotes[0];
        let category = Object.keys(quotes)[Math.floor(Math.random() * Object.keys(quotes).length)];
        
        console.log(quotes);
        console.log(category);

        let quote = quotes[category][Math.floor(Math.random() * quotes[category].length)];
        if (quote.quote == quote.author) {
          quote.author = category;
        }
        // “ -> &#8220;
        // ” -> &#8221;
        // — -> &#8212;
        $('.previewText').html(`&#8220${quote.quote}&#8221<br><span style="text-align: right; width: 100%; display: block;">&#8211 ${quote.author}</span>`);
      }
    })
  }

  getQuote();

  // get the fonts from google fonts
  $.ajax({
    url: "https://www.googleapis.com/webfonts/v1/webfonts?key=" + google_api_key + "&sort=alpha",
    success: function(data) {
      // mix data.items 
      var mixed = data.items.sort(function(item1, item2) {
        var rand = Math.round(Math.random());
        return rand < 0.5 ? 1 : rand > 0.5 ? -1 : 0
      });
      // create the font select box
      var select = $('#fontSelector');
      // add the fonts to the select box
      for (var i = 0; i < mixed.length; i++) {
        var font = mixed[i].family;
        select.append($('<option>').text(font).val(font));
      }
      select.change(function() {
        // add the font to the head of the page
        $('head #font').attr('href', 'https://fonts.googleapis.com/css?family=' + $(this).val());
        var font = $(this).val();
        $('.previewText').css('font-family', font);
        $('#fontInfo').html(`<a href="https://fonts.google.com/specimen/${font}" target="_blank">
          Font: ${font} (${mixed.find(item => item.family == font).category})
        </a>`);
      });
      
      $('#fontSelector').change();

      $('body')[0].addEventListener('click', function(e) {
        if(e.target.tagName == 'BODY') {
          next()
        }
      });
      window.addEventListener('keydown', function(e) {
        if(e.target.tagName == 'BODY'){
          if (e.key == 'ArrowRight') {
            next()
          } else if (e.key == 'ArrowLeft') {
            prev();
          } else if (e.key == 'ArrowUp') {
            zoomIn();
          } else if (e.key == 'ArrowDown') {
            zoomOut();
          } else if (e.key == ' ') {
            getQuote();
          }
        }
      });
      window.addEventListener('wheel', function(e) {
        console.log(e.deltaY)
        if(e.deltaY > 0) {
          zoomOut();
        } else {
          zoomIn();
        }
      });

      window.addEventListener('mousemove', showControlOnMove);
      window.addEventListener('touchmove', showControlOnMove);
      // on mouse over 

      // window.trigger('mousemove');
      // window.trigger('touchmove');
      $('window').trigger('mousemove');
      $('window').trigger('touchmove');

      $('#controls')[0].addEventListener('mousemove', function() {
        clearTimeout(window.hideControls);
        window.removeEventListener('mousemove', showControlOnMove);
        window.removeEventListener('touchmove', showControlOnMove);
      });

      $('#controls')[0].addEventListener('touchmove', function() {
        clearTimeout(window.hideControls);
        window.removeEventListener('mousemove', showControlOnMove);
        window.removeEventListener('touchmove', showControlOnMove);
      });

      $('#controls')[0].addEventListener('mouseout', function() {
        window.addEventListener('mousemove', showControlOnMove);
        window.addEventListener('touchmove', showControlOnMove);
      });

      $('#controls')[0].addEventListener('touchend', function() {
        window.addEventListener('mousemove', showControlOnMove);
        window.addEventListener('touchmove', showControlOnMove);
      });

      $('#controls #saveCapture').click(function() {
        // hide the controls
        $('#controls').hide();
        if(window.location !== window.parent.location){
          document.body.style.background = "#000"
        }
        html2canvas(document.body).then(function(canvas) {
          var a = document.createElement('a');
          a.href = canvas.toDataURL();
          a.download = 'font-select-capture.png';
          a.click();
          // show the controls
          $('#controls').show();
          if(window.location !== window.parent.location){
            document.body.style.background = "#0007"
          }
        });
      });

      $('#controls #copyCapture').click(function() {
        // hide the controls
        $('#controls').hide();
        if(window.location !== window.parent.location){
          document.body.style.background = "#000"
        }
        html2canvas(document.body).then(function(canvas) {
          // copy the canvas to the clipboard
          canvas.toBlob(function(blob) {
            if(navigator.clipboard){
              // check if ClipboardItem is supported
              if (typeof ClipboardItem === 'function') {
                var item = new ClipboardItem({ "image/png": blob });
              } else {
                var item = new Blob([blob], { type: "image/png" });
              }
              if(typeof navigator.clipboard.write === 'function'){
                navigator.clipboard.write([item])
              } else {
                navigator.clipboard.writeText(canvas.toDataURL());
              }
            } else {
              var a = document.createElement('a');
              a.href = canvas.toDataURL();
              a.target = '_blank';
              a.click();
            }
          });
          // show the controls
          $('#controls').show();
          if(window.location !== window.parent.location){
            document.body.style.background = "#0007"
          }
        });
      });

      $('#controls #backgroundImageBtn').click(function() {
        // file input
        var fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*';
        fileInput.click();
        fileInput.addEventListener('change', function() {
          var file = fileInput.files[0];
          var reader = new FileReader();
          reader.onload = function(e) {
            // ass cover all the screen
            document.body.style.backgroundImage = `url(${e.target.result})`;
            document.body.style.backgroundSize = 'cover';
            document.body.style.backgroundPosition = 'center';
            document.body.style.backgroundRepeat = 'no-repeat';
          }
          reader.readAsDataURL(file);
        });
      });

      $('#controls #backgroundColorBtn').click(function() {
        // color input
        var colorInput = document.createElement('input');
        colorInput.type = 'color';
        colorInput.click();
        colorInput.addEventListener('change', function() {
          document.body.style.backgroundImage = 'none';
          document.body.style.backgroundColor = colorInput.value;
        });
      });

      $('#controls #foregroundColorBtn').click(function() {
        // color input
        var colorInput = document.createElement('input');
        colorInput.type = 'color';
        colorInput.click();
        colorInput.addEventListener('change', function() {
          $('.previewText').css('color', colorInput.value);
        });
      });

      $('#controls #random').click(function() {
        // random select a font from #fontSelector
        var options = $('#fontSelector option');
        var random = Math.floor(Math.random() * options.length);
        $('#fontSelector').val(options[random].value);
        $('#fontSelector').change();
      });

      // shareTwitter / take a screenshot and share it on twitter
      $('#controls #RandomQuote').click(function() {
        getQuote();
      });

      $('.previewText').on('mouseover', function(e) {
        e.preventDefault();
        if($(this).find('#dragIcon').length == 0) {
          $(this).append(`<span id="dragIcon">
            <i class="fa fa-arrows rotate-45"></i>
          </span>`);

          $(this).find('#dragIcon').css({
            'position': 'absolute',
            'top': '0',
            'left': '0',
            'color': '#fff',
            'opacity': '1',
            'z-index': '9999',
            'padding': '5px',
            'font-size': '1.5rem'
          });
        }
        $('.previewText').draggable({
          containment: 'parent',
          // dragIcon for the text
          handle: '#dragIcon',
        });
      });

      $('.previewText').on('mouseout', function(e) {
        e.preventDefault();
        $(this).find('#dragIcon').remove();
      });



      // jquery.contextMenu.min.js
      // create a context menu for body
      // custom width and height
      $.contextMenu({
        selector: 'body',
        width: '200px',
        callback: function(key, options) {
          switch(key) {
            case 'addText':
              // add a text with events
              var clone = $('.previewText:first').clone(true);
              clone.text('Double click to edit');
              $('body').append(clone);
              break;
            case 'saveCapture':
              $('#controls #saveCapture').click();
              break;
            case 'copyCapture':
              $('#controls #copyCapture').click();
              break;
            case 'backgroundImageBtn':
              $('#controls #backgroundImageBtn').click();
              break;
            case 'backgroundColorBtn':
              $('#controls #backgroundColorBtn').click();
              break;
            case 'foregroundColorBtn':
              $('#controls #foregroundColorBtn').click();
              break;
            case 'random':
              $('#controls #random').click();
              break;
            case 'RandomQuote':
              $('#controls #RandomQuote').click();
              break;
          }
        },
        items: {
          "addText": {name: "Add Text", icon: "add"},
          "sep1": "---------",
          "saveCapture": {name: "Save Capture", icon: "fa-save"},
          "copyCapture": {name: "Copy Capture", icon: "fa-copy"},
          "sep2": "---------",
          "backgroundImageBtn": {name: "Background Image", icon: "fa-image"},
          "backgroundColorBtn": {name: "Background Color", icon: "fa-paint-brush"},
          "foregroundColorBtn": {name: "Foreground Color", icon: "fa-paint-brush"},
          "sep3": "---------",
          "random": {name: "Random Font", icon: "fa-random"},
          "RandomQuote": {name: "Random Quote", icon: "fa-quote-right"},
        },
        events: {
          show: function(options) {
            // hide the controls
            $('#controls').hide();
          },
          hide: function(options) {
            // show the controls
            $('#controls').show();
          }
        }
      });

    }
  });
});

}( jQuery ));

if(window.location !== window.parent.location){
  document.addEventListener("DOMContentLoaded", function() {
    document.body.style.background = "#0007"
  });
}
