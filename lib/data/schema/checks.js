"use strict";function isPost(r){return r.hasOwnProperty("html")&&r.hasOwnProperty("markdown")&&r.hasOwnProperty("title")&&r.hasOwnProperty("slug")}function isTag(r){return r.hasOwnProperty("name")&&r.hasOwnProperty("slug")&&r.hasOwnProperty("description")&&r.hasOwnProperty("parent")}function isUser(r){return r.hasOwnProperty("bio")&&r.hasOwnProperty("website")&&r.hasOwnProperty("status")&&r.hasOwnProperty("location")}function isNav(r){return r.hasOwnProperty("label")&&r.hasOwnProperty("url")&&r.hasOwnProperty("slug")&&r.hasOwnProperty("current")}module.exports={isPost:isPost,isTag:isTag,isUser:isUser,isNav:isNav};