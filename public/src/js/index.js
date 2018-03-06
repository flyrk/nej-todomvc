NEJ.define([
  'base/element',
  'base/event',
  'util/template/jst'
], function(_e, _v, _t, _p) {
  var _cach_list = [
    { value: 1 },
    { value: 2 },
    { value: 3 },
    { value: 4 }
  ];
  var _html_seed = _t._$add('jst-template');

  /*****Begin function define*****/
  function updateTpl(cach_data) {
    _t._$render(
      'template-box',
      _html_seed,
      { items: cach_data }
    );
  }

  function eventHandle(idx, func) {
    return function(_event) {
      func(_event, idx);
    }
  }

  function deleteItem(_event, idx) {
    if (_event.target.className === 'destroy' && idx < _cach_list.length) {
      _cach_list.splice(idx, 1);
      updateTpl(_cach_list);
      init();
    }
  }

  function init() {
    var _item_parent = _e._$get('todo-list');
    var _item_list = _e._$getByClassName(_item_parent, 'todo-items');

    for (var i = _item_list.length - 1; i >= 0; i--) {
      _v._$addEvent(
        _item_list[i],
        'click',
        eventHandle(i, deleteItem)
      );
    }
  }
  /*****End function define*****/
  updateTpl(_cach_list);  
  init();
});
