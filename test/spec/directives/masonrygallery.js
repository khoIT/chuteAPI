'use strict';

describe('Directive: masonryGallery', function () {

  // load the directive's module
  beforeEach(module('mytodoApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<masonry-gallery></masonry-gallery>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the masonryGallery directive');
  }));
});
