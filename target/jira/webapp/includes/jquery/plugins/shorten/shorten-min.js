define("jira/ajs/shorten/shortener",["jira/util/formatter","jira/ajs/control","jira/data/local-storage","jquery"],function(t,e,i,n){return e.extend({_getDefaultOptions:function(){return{items:"a, span",numRows:1,shortenText:"hide",shortenOnInit:!0,persist:!0,expandButtonTooltip:t.I18n.getText("viewissue.shorten.view.more"),collapseButtonTooltip:t.I18n.getText("viewissue.shorten.hide")}},init:function(t){"string"==typeof t&&(t={element:t}),t=t||{},this.options=n.extend(this._getDefaultOptions(),t),this._timerId=0,this.expanded=!1,this.$container=n(this.options.element),this._assignEvents("body",document.body),this._ready()},_isValid:function(){return!this.initialized&&this.$container.is(":visible")&&this.$container.children().length>0},_ready:function(){this._isValid()&&(this.$items=this.$container.children(this.options.items),this.$expandButton=this._render("expandButton"),this.$collapseButton=this._render("collapseButton"),this._assignEvents("expand-button",".shortener-expand"),this._assignEvents("collapse-button",".shortener-collapse"),(!n.browser.msie||n.browser.version>="9")&&this._assignEvents("resize-region",window),this._isCollapsedOnInit()?this.collapse():this.expand(),this.initialized=!0)},_renders:{expandButton:function(){return n("<a href='#' class='ellipsis shortener-expand'></a>").attr("title",this.options.expandButtonTooltip).add("<br>")},collapseButton:function(){return n("<a href='#' title='Hide' class='icon icon-hide shortener-collapse'></a>").append(n("<span>").text(this.options.collapseButtonTooltip))}},_events:{"expand-button":{click:function(t){t.currentTarget===this.$expandButton[0]&&(t.preventDefault(),this.expand(),this._saveState("expanded"))}},"collapse-button":{click:function(t){t.currentTarget===this.$collapseButton[0]&&(t.preventDefault(),this.collapse(),this._saveState("collapsed"),this.$container.scrollIntoView())}},"resize-region":{resize:function(){if(clearTimeout(this._timerId),!this.expanded){var t=this;this._timerId=setTimeout(function(){t.collapse()},400)}}},body:{tabSelect:function(){this._ready()}}},_saveState:function(t){try{i.setItem("AJS.Shortener#"+this.$container.closest("[id]").attr("id"),t)}catch(t){}},_loadState:function(){return i.getItem("AJS.Shortener#"+this.$container.closest("[id]").attr("id"))},_isCollapsedOnInit:function(){var t=this._loadState();return null!==t?"expanded"!==t:this.options.shortenOnInit},_removeButtons:function(){this.$expandButton.remove(),this.$collapseButton.remove()},_getOverflowIndex:function(){if(this.$items.length>1)for(var t=1,e=-1,i=0;i<this.$items.length;i++){var n=this.$items.eq(i).offset().left;if(n<=e&&++t>this.options.numRows)return i;e=n}return-1},expand:function(){this._removeButtons(),this._getOverflowIndex()>0&&(this.$collapseButton=this._render("collapseButton"),this.$container.append(this.$collapseButton),this.$container.css("height","auto"),n.browser.msie&&n.browser.version<"9"&&n("body").toggleClass("reflow")),this.expanded=!0},collapse:function(){this._removeButtons();var e=this._getOverflowIndex();if(e>0){this.$container.css({position:"absolute",visibility:"hidden",width:this.$container[0].clientWidth+"px"});var i=this.$expandButton.first();do{var s=this.$items.length-e;i.text("("+s+")"),this.$expandButton.insertBefore(this.$items[e]),e--;var o=this.$items.eq(e).offset(),r=this.$expandButton.offset();if(o.left<r.left&&r.top<o.top+10)break}while(e>0);var a=e<this.$items.length-1?this.$items.eq(e+1).offset().top-this.$container.offset().top+"px":"auto";this.$container.css({height:a,position:"static",visibility:"visible",width:"auto"}),i.attr("title",t.format(this.options.expandButtonTooltip,s)),n.browser.msie&&n.browser.version<"9"&&n("body").toggleClass("reflow")}else this.$container.css("height","auto");this.expanded=!1}})}),define("jira/jquery/plugins/shorten/shorten",["jira/ajs/shorten/shortener","jquery"],function(t,e){e.fn.shorten=function(e){var i=[];return e=e||{},this.each(function(){e.element=this,i.push(new t(e))}),i}}),AJS.namespace("AJS.Shortener",null,require("jira/ajs/shorten/shortener")),function(){require("jira/jquery/plugins/shorten/shorten")}();