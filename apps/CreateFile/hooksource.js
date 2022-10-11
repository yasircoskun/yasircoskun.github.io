const createCSS = (url) => {
  let link  = document.createElement('link');
  link.rel  = 'stylesheet';
  link.type = 'text/css';
  link.href = url;
  link.media = 'all';
  return link
}

const regex_replace_6_hex = (regex, source_code) => {
  let m;

  while ((m = regex.exec(source_code)) !== null) {
      // This is necessary to avoid infinite loops with zero-width matches
      if (m.index === regex.lastIndex) {
          regex.lastIndex++;
      }
      
      // The result can be accessed through the `m`-variable.
      m.forEach((match, groupIndex) => {
        if(groupIndex == 0){
          if(match.indexOf(';') != -1){
            end_of_statement = ";";
          }else{
            end_of_statement = "}";
          } 
          source_code = source_code.replaceAll(match, match.split(end_of_statement)[0]+"88"+end_of_statement);
          //console.log(`Found match, group ${groupIndex}: ${match}`);
        }
      });
  }
  return source_code
}

const regex_replace_3_hex = (regex, source_code) => {
  let m;

  while ((m = regex.exec(source_code)) !== null) {
      // This is necessary to avoid infinite loops with zero-width matches
      if (m.index === regex.lastIndex) {
          regex.lastIndex++;
      }
      console.log(m)
      // The result can be accessed through the `m`-variable.
      m.forEach((match, groupIndex) => {
        if(groupIndex == 0){
          if(match.indexOf(';') != -1){
            end_of_statement = ";";
          }else{
            end_of_statement = "}";
          } 

          source_code = source_code.replaceAll(match, match.split(end_of_statement)[0]+"5"+end_of_statement);
          console.log(`Found match, group ${groupIndex}: ${match}`);
          console.log(match.split(end_of_statement)[0]+"5");
        }

      });
  }
  return source_code
}

const loadSource = (url, type) => {
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.open( "GET", url, false ); // false for synchronous request
  xmlHttp.send(null);
  let source_code = xmlHttp.responseText
  source_code = regex_replace_6_hex(/(background-color:|--bs-[A-Za-z0-9\-]*:)#[ABCDEFabcdef0-9]{6}(;|})/gm, source_code)
  source_code = regex_replace_3_hex(/(background-color:|--bs-[A-Za-z0-9\-]*:)#[ABCDEFabcdef0-9]{3}(;|})/gm, source_code)
  // source_code = source_code.replaceAll(color_regex, color_regex+"88")
  source_code = "/*Yasir*/" + source_code;
  let blob = new Blob([source_code], {type: type});
  let blob_url = URL.createObjectURL(blob);
  document.querySelector("link[href='"+url+"']").remove()
  document.getElementsByTagName('head')[0].appendChild(createCSS(blob_url));
}

if(window.location !== window.parent.location){
  loadSource("https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css",'text/css')
  document.addEventListener("DOMContentLoaded", function() {
    document.body.style.filter = "contrast(1) grayscale(1) invert(1)"
    document.body.style.background = "#0003"
    document.body.style.opacity= "0.5";
  });
  
}
