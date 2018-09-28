let ContentManager = function(){
    this.loaded = [];
    let self = this;

    this.setContent = function(name){
        if(!self.loaded[name]){
            jQuery.get( "html/"+name+".html", function( html ) {
                self.loaded[name] = html;
                attachHtml(name, html);
            }).fail(function(error) {
                console.log("The following error occured ContentManager: ",error);
                contentManager.setContent("introduction");

            });
        }else{
            attachHtml(name, self.loaded[name]);
        }
    }

    let attachHtml = function(name, html){
        $( ".content" ).html( html );
        $( ".active").removeClass("active");
        $( "." +name).addClass( "active" );
        MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
        if(typeof simulation1 !== 'undefined' && name == "simulation"){
            $("input").tooltip('enable');
            simulation1.init();
        }
    }
}

var contentManager = new ContentManager();
var hash = window.location.hash.substring(1);
if(hash){
    contentManager.setContent(hash);
}else{
    contentManager.setContent("introduction");
}

