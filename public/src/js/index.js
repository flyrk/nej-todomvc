NEJ.define([
  'base/element',
  'base/event',
  'util/ajax/xdr'
], function(_e, _v, _j, _p) {
  var _cach_list = [];
  var _cach_active_list = [];
  var _cach_completed_list = [];
  var _left_item_count = 0;
  var _isClear = false;
  var _pro = _p;

  var _parent = _e._$get('todo-box');
  var _input_info = _e._$getByClassName(_parent, 'new-todo')[0];
  var _toggle_all = _e._$getByClassName(_parent, 'toggle-all')[0];
  var _selectors = _e._$getByClassName(_parent, 'filters')[0];
  var _clear_btn = _e._$getByClassName(_parent, 'clear-completed')[0];

  /*****Begin function define*****/
  function eventHandle(params, funcs) {
    return function (_event) {
      funcs.forEach(function (func) {
        func(_event, params);
      });
    }
  }
  
  function capitalCase(str) {
    return str[0].toUpperCase() + str.slice(1);
  }

  function localHash() {
    return window.location.hash.replace('#\/', '');
  }

  _p._refreshItems = function(_list) {
    var _todo_list = _e._$get('todo-list');
    // 因为每次都是直接从后端拿数据，所以需要把之前的list item清除
    _e._$getChildren(_todo_list).forEach(function(node) {
      _e._$remove(node, false);
    });
    _list.forEach(function(item, index) {
      _pro._addItem(item, index);
    });
  }

  _p._refreshCount = function() {
    var _todo_count = _e._$getByClassName(_parent, 'todo-count')[0];
    _todo_count.innerText = _left_item_count + ' items left';
  }

  _p._remoteAddItem = function(new_item) {
    var _requestId = _j._$request('/api/all', {
      sync: false,
      method: 'post',
      type: 'json',
      data: JSON.stringify(new_item),
      timeout: 2000,
      mode: 0 || 1 || 2 || 3,
      onload: function (_data) {
        console.log('success add');
        _pro._addItem(new_item, _cach_list.length - 1);
        _input_info.value = '';
        _left_item_count++;
        _pro._refreshCount();
      },
      onerror: function (_error) {
        alert('添加错误，请重新再试');
      }
    });
  }

  _p._remoteChangeCompleteItem = function(params) {
    var _requestId = _j._$request('/api/completed', {
      sync: false,
      method: 'post',
      type: 'json',
      data: JSON.stringify(params),
      timeout: 2000,
      mode: 0 || 1 || 2 || 3,
      onload: function (_data) {
        console.log('success add');
        _pro._refreshCount();
      },
      onerror: function (_error) {
        alert('添加错误，请重新再试');
        if (~params.itemType.indexOf('completed')) {
          _left_item_count--;
        } else {
          _left_item_count++;
        }
      }
    });
  }

  _p._remoteDeleteItem = function (_event, params) {
    var _requestId = _j._$request('/api/all', {
      sync: false,
      method: 'delete',
      type: 'json',
      data: JSON.stringify(params),
      timeout: 2000,
      mode: 0 || 1 || 2 || 3,
      onload: function (_data) {
        console.log('success delete');
        _e._$remove(_event.target.parentNode.parentNode, false);
        _left_item_count--;
        _pro._refreshCount();
      },
      onerror: function (_error) {
        console.log('请求错误，请重新再试');
      }
    });
  }

  _p._remoteGetAllItems = function() {
    var _requestId = _j._$request('/api/all', {
      sync: false,
      method: 'get',
      type: 'json',
      timeout: 2000,
      mode: 0 || 1 || 2 || 3,
      onload: function(_data) {
        _cach_list = _data || [];
        _pro._refreshItems(_cach_list);
        var _tmp_count = 0;
        _cach_list.forEach(function(item) {
          if (!~item.itemType.indexOf('completed')) {
            _tmp_count++;
          }
        });
        _left_item_count = _tmp_count;
        _pro._refreshCount();
      },
      onerror: function(_error) {
        alert('请求错误，请重新再试');
        _cach_list = [];
        _pro._refreshItems([]);
      }
    });
  }

  _p._remoteGetActiveItems = function () {
    var _requestId = _j._$request('/api/active', {
      sync: false,
      method: 'get',
      type: 'json',
      timeout: 2000,
      mode: 0 || 1 || 2 || 3,
      onload: function (_data) {
        _cach_active_list = _data || [];
        _pro._refreshItems(_cach_active_list);
      },
      onerror: function (_error) {
        alert('请求错误，请重新再试');
        _cach_active_list = [];
        _pro._refreshItems([]);
      }
    });
  }

  _p._remoteGetCompletedItems = function () {
    var _requestId = _j._$request('/api/completed', {
      sync: false,
      method: 'get',
      type: 'json',
      timeout: 2000,
      mode: 0 || 1 || 2 || 3,
      onload: function (_data) {
        _cach_completed_list = _data || [];
        _pro._refreshItems(_cach_completed_list);
      },
      onerror: function (_error) {
        alert('请求错误，请重新再试');
        _cach_completed_list = [];
        _pro._refreshItems([]);
      }
    });
  }

  _p._remoteClearCompletedItems = function() {
    var _requestId = _j._$request('/api/completed/clear', {
      sync: false,
      method: 'delete',
      type: 'json',
      timeout: 2000,
      mode: 0 || 1 || 2 || 3,
      onload: function (_data) {
        _pro._switchSelector(localHash());
      },
      onerror: function (_error) {
        alert('请求错误，请重新再试');
      }
    });
  }

  _p._addItem = function(item, index) {
    _e._$create('li', 'todo-items', 'todo-list');
    var todo_list = _e._$get('todo-list');
    var new_item = _e._$getChildren(todo_list)[index];
    if (item.itemType && item.itemType.indexOf('completed') !== -1) {
      _e._$addClassName(new_item, 'completed');
    }
    _e._$create('div', 'view', new_item);
    var new_view = _e._$getByClassName(new_item, 'view')[0];
    _e._$create('input', 'toggle', new_view);
    var new_check = _e._$getByClassName(new_view, 'toggle')[0];
    new_check.type = 'checkbox';
    _e._$create('label', 'item-value', new_view);
    var new_label = _e._$getChildren(new_view)[1];
    new_label.innerText = item.itemName;
    _e._$create('button', 'destroy', new_view);
    var new_destroy = _e._$getByClassName(new_view, 'destroy')[0];
    _v._$addEvent(
      new_view,
      'click',
      eventHandle(
        {
          id: index,
          itemName: item.itemName,
          itemType: item.itemType ? item.itemType : ['all', 'active']
        },
        [completeItem, deleteItem]
      )
    );
  }

  _p._switchSelector = function(_select_type) {
    switch (_select_type) {
      case 'all':
        _pro._remoteGetAllItems();
        break;
      case 'active':
        _pro._remoteGetActiveItems();
        break;
      case 'completed':
        _pro._remoteGetCompletedItems();
        break;
      default:
        _pro._remoteGetAllItems();
    }

    if (_select_type !== '') {
      var _old_selected = _e._$getByClassName(_selectors, 'selected')[0];
      _e._$delClassName(_old_selected, 'selected');
      var _selector_items = _e._$getChildren(_selectors);
      for (var i = 0, l = _selector_items.length; i < l; i++) {
        var _new_selected = _e._$getChildren(_selector_items[i])[0];
        if (_new_selected.innerText === capitalCase(_select_type)) {
          _e._$addClassName(_new_selected, 'selected');
        }
      }
    }
  }

  function completeItem(_event, params) {
    var class_name = _event.target.className;
    if (class_name === 'toggle') {
      var _parent_view = _event.target.parentNode;
      var _parent_li = _parent_view.parentNode;
      if (_parent_li.className.indexOf('completed') !== -1) {
        _e._$delClassName(_parent_li, 'completed');
        params.itemType = ['all', 'active'];
        _left_item_count++;
      } else {
        _e._$addClassName(_parent_li, 'completed');
        params.itemType = ['all', 'completed'];
        _left_item_count--;
      }
        
      _pro._remoteChangeCompleteItem(params);
    }
  }

  function completeAllItem(_event) {

  }

  function deleteItem(_event, params) {
    if (_event.target.className === 'destroy' && params.id < _cach_list.length) {
      _pro._remoteDeleteItem(_event, params);
    }
  }

  _p._init = function() {
    var _select = localHash();
    _p._switchSelector(_select);

    _v._$addEvent(_input_info, 'keydown', function(_event) {
      if (_event.keyCode === 13 && _input_info.value !== '') {
        _cach_list.push({ itemName: _input_info.value });
        _pro._remoteAddItem({
          id: _cach_list.length - 1,
          itemName: _input_info.value,
          itemType: ['all', 'active']
        });
      }
    });

    _v._$addEvent(_toggle_all, 'click', function() {
      var _todo_list = _e._$get('todo-list');
      var params = {};
      _e._$getChildren(_todo_list).forEach(function (node) {
        var cur_view = _e._$getByClassName(node, 'view')[0];
        var cur_label = _e._$getChildren(cur_view)[1];
        params.itemName = cur_label.innerText;
        if (_isClear) {
          if (~node.className.indexOf('completed')) {
            _e._$delClassName(node, 'completed');
            params.itemType = ['all', 'active'];
            _left_item_count++;
            _pro._remoteChangeCompleteItem(params);
          }
        } else {
          if (!~node.className.indexOf('completed')) {
            _e._$addClassName(node, 'completed');
            params.itemType = ['all', 'completed'];
            _left_item_count--;
            _pro._remoteChangeCompleteItem(params);
          }
        }
      });
      _isClear = !_isClear;
    });

    _v._$addEvent(_selectors, 'click', function(_event) {
      var _new_selected = _v._$getElement(_event);
      var _select_type = _new_selected.innerText.toLowerCase();
      _pro._switchSelector(_select_type);
    });
    
    _v._$addEvent(_clear_btn, 'click', function(_event) {
      _pro._remoteClearCompletedItems();
    });
  }
  /*****End function define*****/
  _p._init();

  return _p;
});
