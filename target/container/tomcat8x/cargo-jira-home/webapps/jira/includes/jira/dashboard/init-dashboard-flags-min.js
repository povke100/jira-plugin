require(["jquery","wrm/data","jira/flag"],function(s,a,e){"use strict";s(function(){var s=a.claim("dashboardInfoMessage"),r=a.claim("dashboardInstallMessage");s&&e.showInfoMsg("",s),r&&e.showSuccessMsg("",r)})});