define("jira/project/browse/paginationview",["marionette","jquery","underscore","jira/util/navigation"],function(e,t,i,a){"use strict";return e.ItemView.extend({template:JIRA.Templates.Project.Browse.pagination,ui:{page:"li a",previous:"li.aui-nav-previous a",next:"li.aui-nav-next a"},events:{"click @ui.page":"clickPage","click @ui.previous":"clickPrevious","click @ui.next":"clickNext"},collectionEvents:{reset:"render"},modelEvents:{change:"render"},onRender:function(){this.unwrapTemplate()},serializeData:function(){var e=a.getRoot()+this.model.getQueryParams(),t=i.extend({url:e},this.collection.state);return t.firstPage=Math.max(t.currentPage-5,t.firstPage),t.totalPages=t.lastPage,t.lastPage=Math.min(t.currentPage+5,t.lastPage),t},clickPage:function(e){e.preventDefault();var i=+t(e.target).attr("data-page");i&&(this.collection.getPage(i),this.trigger("navigate",i))},clickPrevious:function(){this.trigger("navigate-previous")},clickNext:function(){this.trigger("navigate-next")}})});