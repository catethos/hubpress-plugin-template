"use strict";function _interopRequireDefault(e){return e&&e.__esModule?e:{"default":e}}function generateAuthors(e){console.info("AuthorGenerator - generate"),console.log("AuthorGenerator - generate",e);var r="author",t=void 0;if(!_builder2["default"].isTemplateAvailable(r))return e;t=e.data.author?e.data.publishedPosts.filter(function(r){return r.author.login===e.data.author.login}):e.data.publishedPosts;var a=_lodash2["default"].reduce(t,function(e,r){return e[r.author.login]=e[r.author.login]||[],e[r.author.login].push(r),e},{}),o=e;return _lodash2["default"].each(a,function(e,t){var a=e[0].author;a.name=a.name||a.login,a.slug=t,o=_paginationGenerator2["default"].generate({opts:o,posts:e,author:a,template:r,path:"author/"+t+"/"})}),o}Object.defineProperty(exports,"__esModule",{value:!0}),exports.generateAuthors=generateAuthors;var _paginationGenerator=require("./paginationGenerator"),_paginationGenerator2=_interopRequireDefault(_paginationGenerator),_lodash=require("lodash"),_lodash2=_interopRequireDefault(_lodash),_builder=require("./builder"),_builder2=_interopRequireDefault(_builder),_hubpressCoreSlugify=require("hubpress-core-slugify"),_hubpressCoreSlugify2=_interopRequireDefault(_hubpressCoreSlugify);