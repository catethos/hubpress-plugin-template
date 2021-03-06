import Q from 'q';
import request from 'superagent';
import _ from 'lodash';
import { generateIndex } from './indexGenerator';
import { generatePost } from './postGenerator';
import { generatePosts } from './postsGenerator';
import { generateTags } from './tagsGenerator';
import { generateAuthors } from './authorsGenerator';
import Builder from './builder';

function load(name, config) {

  let deferred = Q.defer();
  let promises = [];
  let hubpressUrl = config.urls.hubpress;
  request.get(`${hubpressUrl}/themes/${name}/theme.json?dt=${Date.now()}`)
    .end((err, response) => {
      if (err) {
        deferred.reject(err);
        return;
      }
      let theme = response.body;
      let version = theme.version;
      let files = _.toPairs(theme.files);

      let paginationLoaded = false;
      let navLoaded = false;
      let navigationLoaded = false;

      files.forEach((file) => {
        let deferredFile = Q.defer();
        promises.push(deferredFile.promise);

        paginationLoaded = paginationLoaded || file[0] === 'pagination';
        navLoaded = navLoaded || file[0] === 'nav';
        navigationLoaded = navigationLoaded || file[0] === 'navigation';

        request.get(`${hubpressUrl}/themes/${name}/${file[1]}?v=${version}`)
          .end((err, response) => {
            if (err) {
              deferredFile.reject(err);
              return;
            }
            deferredFile.resolve({
              name: file[0],
              path: file[1],
              content: response.text
            });

          });

      });

      if (!paginationLoaded) {
        let deferredPagination = Q.defer();
        promises.push(deferredPagination.promise);
        request.get(`${hubpressUrl}/hubpress/scripts/helpers/tpl/pagination.hbs`)
          .end((err, response) => {
            if (err) {
              deferredPagination.reject(err);
              return;
            }

            deferredPagination.resolve({
              name: 'pagination',
              path: 'partials/pagination',
              content: response.text
            });
          });
      }

      if (!navLoaded) {
        let deferredNav = Q.defer();
        promises.push(deferredNav.promise);
        request.get(`${hubpressUrl}/hubpress/scripts/helpers/tpl/nav.hbs`)
          .end((err, response) => {
            if (err) {
              deferredNav.reject(err);
              return;
            }
            deferredNav.resolve({
              name: 'nav',
              path: 'partials/nav',
              content: response.text
            });
          });
      }

      if (!navigationLoaded) {
        let deferredNav = Q.defer();
        promises.push(deferredNav.promise);
        request.get(`${hubpressUrl}/hubpress/scripts/helpers/tpl/navigation.hbs`)
          .end((err, response) => {
            if (err) {
              deferredNav.reject(err);
              return;
            }
            deferredNav.resolve({
              name: 'navigation',
              path: 'partials/navigation',
              content: response.text
            });
          });
      }

      Q.all(promises)
        .then((values)=>{
          deferred.resolve({
            version: version,
            files: values
          });
        })
        .catch((error) => {
          console.log(error);
          deferred.reject(error);
        });
    });

  return deferred.promise;
}

export function templatePlugin (hubpress) {

  hubpress.on('requestTheme', function (opts) {
    console.log('Theme plugin', opts);
    // TODO lowerCase will be useless after version 0.6.0
    const themeName = opts.data.config.theme.name.toLowerCase();

    return load(themeName, opts.data.config)
      .then((themeInfos) => {
        const theme = {
          name: themeName,
          files: themeInfos.files,
          version: themeInfos.version
        };

        Builder.registerTheme(opts.data.config, theme);
        Builder.registerFiles(theme.files);

        const mergeTheme = Object.assign({}, theme);
        const data = Object.assign({}, opts.data, {theme: mergeTheme});
        return Object.assign({}, opts, {data});
      });
  });

  hubpress.on('requestGenerateIndex', opts => {
    console.info('Template Plugin - requestGenerateIndex');
    console.log('requestGenerateIndex', opts);
    return generateIndex(opts);
  });

  hubpress.on('requestGeneratePost', opts => {
    console.info('Template Plugin - requestGeneratePost');
    console.log('requestGeneratePost', opts);
    return generatePost(opts, opts.data.post);
  });

  hubpress.on('requestGeneratePosts', opts => {
    console.info('Template Plugin - requestGeneratePosts');
    console.log('requestGeneratePosts', opts);
    return generatePosts(opts, opts.data.post);
  });

  hubpress.on('requestGenerateTags', opts => {
    console.info('Template Plugin - requestGenerateTags');
    console.log('requestGenerateTags', opts);
    return generateTags(opts, opts.data.post);
  });

  hubpress.on('requestGenerateAuthors', opts => {
    console.info('Template Plugin - requestGenerateAuthors');
    console.log('requestGenerateAuthors', opts);
    return generateAuthors(opts, opts.data.post);
  });

}
