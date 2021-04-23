var pSize = 256 * 1024 * 1024, fSize = 256 * 1024 * 1024, contentType = {
  pdf : 'application/pdf',
  jpg : 'image/jpeg',
  jpeg : 'image/jpeg',
  png : 'image/png',
  doc : 'application/msword',
  docx : 'application/octet-stream',
  txt : 'text/plain',
  xls : 'application/octet-stream',
  xlsx : 'application/octet-stream',
  wps: 'application/octet-stream',
  dwg: 'application/octet-stream',
  rar: 'application/octet-stream',
  zip: 'application/x-zip-compressed'
}, thumbnailType = {
    png: 'image/png',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg'
}, image = {
    pdf: 'pdf.png',
    doc: 'doc.png',
    docx: 'docx.png',
    xls:'xls.png',
    xlsx:'xlsx.png',
    zip:'zip.png',
    rar:'rar.png',
    txt:'txt.png',
    wps: 'wps.png',
    dwg: 'dwg.png'
}, hasUpload;

// 初始化
$(function() {
  var path = basePath + '/upload/file-getFile?fileId=', ns = [], kv = {}, dom = [], n,t, p, dealNode = function(list,lvl) {
    var idx, n, id, fs, f, fid,fname, imgd, imgf;
    for (var i = 0, l = list.length; i < l; i++) {
      //idx = ' ' + (lvl ? lvl+'.':'') + (i+1) + ' ';
      n = list[i];
      id = n.categoryId;
      dom.push('<li id="c_');
      dom.push(id);
      if (n.children) {
        dom.push('"><p class="title"><span class="info"><i class="fa fa-folder-open"></i>');
        dom.push(n.categoryName);
        dom.push('</span></p><ul>');
        dealNode(n.children, lvl+1);
        dom.push('</ul>');
      } else {
        if (!readonly || n.upload) {
          dom.push('" class="upload">');
          dom.push('<input id="i_' + id + '" type="file" class="layui-hide" multiple>');
        } else {
          dom.push('">');
        }
        dom.push('<p class="title"><span class="info');
        dom.push(n.required ? ' required">' : '">')
        dom.push('<i class="fa fa-folder-open"></i>');
        dom.push(n.categoryName);
        dom.push('</span><span class="count">');
        fs = n.files;
        if(fs && fs.length){
          dom.push('&nbsp;&nbsp;('+fs.length+')');
        }
        dom.push(readonly && !n.upload ? '</span></p><ul>' : '</span><i class="btn-upload fa fa-upload" title="上传"></i></p><ul>');
        imgd = $('<div id="fl_'+ id +'"></div>').appendTo('#imageView');
        if (fs) {
          imgf = [];
          for (var fi = 0, fl = fs.length; fi < fl; fi++) {
            f = fs[fi];
            fid = f.fileId;
            fname = f.fileName;
            t = fname.split('.').pop().toLocaleLowerCase();
            dom.push('<li id="f_');
            dom.push(fid);
            dom.push('"><p title="' +fname+'" class="title file"><span class="info"><i class="fa fa-file"></i>');
            dom.push(fname.length >15 ? fname.substring(0,15) + '...' + fname.substring(fname.lastIndexOf(".")) : fname);
            dom.push('</span>');

            if (!readonly || n.upload) {
              dom.push('<i class="btn-delete fa fa-trash" style="position: absolute;right: 30px;bottom: 5px;font-size: 22px;" title="删除"></i>');
            }
            dom.push('<i class="btn-download fa fa-download"' )
            dom.push(' data-url="');
            dom.push(path);
            dom.push(fid);
            dom.push('&fileName='+encodeURIComponent(fname) +'"');
            dom.push(' style="position: absolute;right: 5px;bottom: 5px;font-size: 22px;line-height: 16px" title="下载"></i>');

            dom.push('</p></li>');
            
            imgf.push('<div class="img-box"><img id="');
            imgf.push(fid)
            imgf.push('" data-url="');
            imgf.push(path);
            imgf.push(fid);
            imgf.push('&fileName='+encodeURIComponent(fname));
            imgf.push('" src="');
            if (thumbnailType[t]) {
              imgf.push(path);
              imgf.push(fid);
              imgf.push('&fileName='+encodeURIComponent(fname)+'"');
              imgf.push('" data-original="');
              imgf.push(path);
              imgf.push(fid);
              imgf.push('&fileName='+encodeURIComponent(fname));
              imgf.push('"');
            }else{
              imgf.push(basePath + '/static/image/' + image[t]);
              imgf.push('"');
              imgf.push('" data-original="');
              imgf.push(basePath + '/static/image/' + image[t]);
              imgf.push('"');
            }
            imgf.push(' alt="');
            imgf.push(fname);
            imgf.push('"><label>');
            imgf.push(fname);
            imgf.push('</label></div>')
          }
          imgd.append(imgf.join(''));
        }
        dom.push('</ul>');
      }
      dom.push('</li>');
    }
  };
  // 处理分类数据
  for (var i = 0, l = category.length; i < l; i++) {
    n = category[i];
    if(taskKey){//在流程中 处理显示
      if(n.viewTaskKey){
        t =n.viewTaskKey.indexOf(taskKey+':1');
        if(n.viewTaskKey.indexOf('_all:')==-1 && n.viewTaskKey.indexOf(taskKey+':')==-1){
            continue;
        }
        t = n.viewTaskKey.indexOf(taskKey+':1');
        if(n.viewTaskKey.indexOf('_all:1')!=-1 || t!=-1){
            n.upload=true;
            hasUpload = true;
        }
      }
    } else if(inProcess){
      if(n.viewTaskKey){
        continue;
      }
    }
    kv[n.categoryId] = n;
    if (n.parentId) {
      p = kv[n.parentId];
      if (!p.children) {
        p.children = [];
      }
      p.children.push(n);
    } else {
      ns.push(n);
    }
  }
  // 处理已上传文件
  for (var i = 0, l = file.length; i < l; i++) {
    n = file[i];
    p = kv[n.categoryId];
    if(p){
      if (!p.files) {
        p.files = []
      }
      p.files.push(n);
    }
  }
  // 构建dom
  dealNode(ns,0);
  $('#categoryTree').html(dom.join(''));
});
$(document).on('dragenter', function(e) {
  e.stopPropagation();
  e.preventDefault();
});
$(document).on('dragover', function(e) {
  e.stopPropagation();
  e.preventDefault();
});
$(document).on('drop', function(e) {
  e.stopPropagation();
  e.preventDefault();
});

/**
 * 文件上传 js
 */
layui.use([ 'element', 'layer', 'form' ], function() {
  var element = layui.element, upload = layui.upload, layer = layui.layer, form = layui.form,
  $uploadView = $('#uploadView'),$localFileList = $('#localFileList'),$imageView=$('#imageView'),$fileView=$('#fileView'),
  $path=$('#path'),$localFileBar=$('#localFileBar'),$fileBar=$('#fileBar'),$playBar=$('#playBar'),
  //图片查看器
  imageViewer, toolbar={
    zoomIn: true,
    zoomOut: true,
    oneToOne: true,
    reset: true,
    prev: true,
    play: false,
    next: true,
    rotateLeft: true,
    rotateRight: true,
    flipHorizontal: true,
    flipVertical: true
  }, recreateImageViewer = function(){
    if(imageViewer){
      imageViewer.destroy();
    }
    imageViewer = new Viewer($imageView[0], {
      inline: true,
      navbar: false,
      title: false,
      toolbar: toolbar,
      url : 'data-original',
      view : function(event){
        var f = event.detail.originalImage, name=f.alt, t = name.split('.').pop().toLocaleLowerCase(), url = $(f).attr('data-url');
        $localFileBar.hide();
        $localFileList.hide();
        $fileBar.show().find('.fa-tv').removeClass('fa-tv').addClass('fa-th');
        $path.html(f.alt).attr('data-url', url).prev().hide();
        console.log($imageView)
        if(thumbnailType[t]){
          $imageView.show().next().show();
          $fileView.hide();
          $playBar.hide();
          imageViewer.options.viewed=function(){
            //console.log("xxx");
            imageViewer.zoom(.1);
            imageViewer.zoom(.1);
          }
          return;
        } else if(t == 'pdf') {
          url = basePath+'/static/lib/pdfjs/web/viewer.html?file=' + encodeURIComponent(url)
        } else if(t == 'doc' || t == 'docx' || t == 'wps' || t=='txt') {
          //url = basePath+'/oa/gw/gl/html/office?openType=read&type='+t+'&id='+f.id;
        } else {
          $imageView.show().next().show();
          $fileView.hide();
          $playBar.hide();
          return;
        }
        $imageView.hide().next().hide();
        $fileView.show().attr('src', url);
        $playBar.show();
      }

    });
  },
  // 上传
  upfile = function(notLocal, file, categoryId, filename) {
    var list = $("#fl_" + categoryId), path = basePath + '/upload/file-getFile?', formData, img, type;
    if (notLocal) {
      filename = file.name;
      type = filename.split('.').pop().toLocaleLowerCase();
      if (!contentType[type]) {
        return filename + ' 不支持的文件类型';
      }
      if (file.size > fSize || !('pdf' == type || file.size < pSize)) {
        return filename + ' 超出文件限制长度';
      }
    } else {
      type = filename.split('.').pop().toLocaleLowerCase();
    }
    formData = new FormData();
    formData.append('formId', formId);
    formData.append('mainTable', mainTable);
    formData.append('mainTableKey', mainTableKey);
    if(businessKey){
      formData.append('businessKey', businessKey);
    } else {
      formData.append('tmpKey', tmpKey);
    }
    formData.append('categoryId', categoryId);
    if (drag) {
      formData.append('file', file, filename);
    } else {
      formData.append('file', file);
    }


    img = $('<li><p class="title file"><span title="'+filename+'" class="info"><i class="fa fa-file"></i>'+
        (filename.length >15 ? filename.substring(0,15)+'...' + filename.substring(filename.lastIndexOf(".")) : filename)
        +'</span><i class="fa fa-spinner fa-pulse fa-3x fa-fw"></i></li>').appendTo('#c_'+categoryId+'>ul')
    $.ajax({
      method : 'post',
      url : basePath + '/upload/file-uploadFile',
      contentType : false,
      processData : false,
      cache : false,
      dataType : 'json',
      data : formData,
      success : function(res) {
        if (res.success) {
          var d = res.data, c;
          img.attr('id','f_'+d.fileId).find('.fa-spinner').replaceWith('<i class="btn-delete fa fa-trash"' +
              'style="position: absolute;right: 30px;bottom: 5px;font-size: 22px;line-height: 16px" title="删除"></i><i class="btn-download fa fa-download" data-url=" ' + path + $.param({fileId: d.fileId,fileName: d.fileName})+'" ' +
              ' style="position: absolute;right: 5px;bottom: 5px;font-size: 22px;line-height: 16px" title="下载"> </i> ')

          img.parent().slideDown("fast");
          if (thumbnailType[type]) {
            list.append('<div class="img-box"><img id="' + d.fileId + '" data-url="' + path + $.param({
              fileId: d.fileId,
              fileName: d.fileName
            }) +'" data-original="' + path + $.param({
              fileId: d.fileId,
              fileName: d.fileName
            }) + '" src="'+ path + $.param({
              fileId: d.fileId + '',
              fileName: d.fileName
            }) +'" alt="' + d.fileName + '"><label>'+ d.fileName+'</label></div>');
          } else {
            list.append('<div class="img-box"><img id="' +d.fileId + '" data-url="' + path + $.param({
              fileId: d.fileId,
              fileName: d.fileName
            }) + '" src="' + basePath + '/static/image/' + image[type] + '" alt="' + d.fileName + '"><label>'+ d.fileName+'</label></div>');
          }
          c = list.children().length;
          $('#c_'+categoryId+' .count').html(c ? '&nbsp;&nbsp;('+c+')':'');
          imageViewer.update();
        } else {
          layer.tips('上传图片失败:' + res.data, img, {
            tips : 3,
            end : function() {
              img.remove();
            }
          });
        }
      }
    });
  }, drag = false;
  layer.ready(function(){
    recreateImageViewer();
  });

  $uploadView.on('click', '.title:not(.file)', function() {
    var that = $(this), icon = that.find('.info i');
    if (icon.is('.fa-folder')) {
      icon.removeClass('fa-folder');
      icon.addClass('fa-folder-open')
    } else {
      icon.removeClass('fa-folder-open');
      icon.addClass('fa-folder');
    }
    that.next().slideToggle("fast");
  }).on('click', '.file', function() {
    var id=$(this).parent()[0].id.substr(2);
    imageViewer.view($imageView.find('img').index($('#'+id)));
  }).on('click','.btn-download',function (e) {
      var url = $(e.target).attr('data-url');
      if(url){
          $('#downloadForm').attr('action', url).submit();
      }
      return false;
  });
  if (!readonly || hasUpload) {
    try{
      fso = new ActiveXObject('Scripting.FileSystemObject');
    }catch(e){
    }

    $uploadView.on('click', '.btn-upload', function(e) {
      var el = $(this).parent().prev().click();
      e.stopPropagation();
    }).on('dragover', '.upload', function(e) {
      $(this).children().addClass('layui-bg-blue');
    }).on('dragleave', '.upload', function(e) {
      $(this).children().removeClass('layui-bg-blue');
    }).on('drop', '.upload', function(e) {
      var files = e.originalEvent.dataTransfer.files, id = this.id.substr(2), msg, res, el = $(this).children().removeClass('layui-bg-blue').last(), dir = localDir, f, stream, ch, bs;
      e.stopPropagation();
      e.preventDefault();
      e.originalEvent.preventDefault();
      e.originalEvent.stopPropagation();
      if (drag) {
        try {
          stream = new ActiveXObject('ADODB.Stream');
          $localFileList.find('.selected').each(function() {
            var filename = $(this).children('label').html();
            stream.Open();
            stream.Type = 1;
            stream.LoadFromFile(dir + filename);
            ch = stream.Read();
            stream.Close();
            with (new ActiveXObject('MSXML2.DOMDocument').createElement('node')) {
              dataType = 'bin.base64';
              // dataType='bin.hex';
              nodeTypedValue = ch;
              bs = text;
            }
            upfile(false, base64ToBlob(bs.replace(/\s/g, ''), filename), id, filename);
          }).remove();
        } catch (e) {
        	layer.msg('文件名中包含有&等特殊字符,不能直接拖拽上传',{icon : 5});
        }
        drag = false;
      } else {
        if (files && files.length) {
          msg = [];
          for (var i = 0, l = files.length; i < l; i++) {
            res = upfile(true, files[i], id);
            if (res) {
              msg.push(res);
            }
          }
          if (msg.length) {
            layer.msg(msg.join('<br>'), {
              icon : 5
            });
          }
        }
      }
    }).on('change', 'input:file', function(e) {
      var input = $(this), files = e.target.files, id = this.id.substr(2), msg, res;
      if (files && files.length) {
        msg = [];
        for (var i = 0, l = files.length; i < l; i++) {
          res = upfile(true, files[i], id);
          if (res) {
            msg.push(res);
          }
        }
        if (msg.length) {
          layer.msg(msg.join('<br>'), {
            icon : 5
          });
        }
      }
      input.replaceWith(input.val('').clone());
    }).on('click', '.btn-delete', function(e) {
      var li = $(this).parent().parent(), id = li[0].id.substr(2), img = $('#'+id).parent(),  list = img.parent(), pid = list[0].id.substr(3);
      $.post(basePath + '/upload/file-removeFile', {
        businessKey : businessKey,
        formId : formId,
        mainTable : mainTable,
        mainTableKey : mainTableKey,
        categoryId : pid,
        fileId : id,
        fileName : img[0].alt
      }, function(res) {
        if (res.success) {
          var c = list.children().length;
          c=c-1;
          li.parent().parent().find('.count').html(c ? '&nbsp;&nbsp;('+c+')':'');
          li.remove();
          img.remove();
          recreateImageViewer();
        } else {
          layer.msg(res.data, {
            icon : 5
          });
        }
      });
      return; false
    }).on('click','.btn-download',function (e) {
      var url = $(e.target).attr('data-url');
      if(url){
        $('#downloadForm').attr('action', url).submit();
      }
      return false;
    });
    
    if (fso) {
      if (localDir) {
        $path.html(localDir).attr('title', localDir);
        getLocalFiles();
      } else {
        setLocalFolder();
      }
      
      $localFileList.on('mouseup', function(e) {
        var s = window.getSelection(), append = e.ctrlKey, ss;
        if (s) {
          ss = s.toString();
          if (append) {
            $localFileList.find('label').each(function() {
              var that = $(this), t = that.html();
              if (ss.indexOf(t) != -1) {
                that.parent().addClass('selected');
              }
            });
          } else {
            $localFileList.find('.selected').removeClass('selected');
            $localFileList.find('label').each(function() {
              var that = $(this), t = that.html();
              if (ss.indexOf(t) != -1) {
                that.parent().addClass('selected');
              }
            });
          }
          s.removeAllRanges();
        }
      }).on('click', '.img-box', function(e) {
        var box = $(this), append = e.ctrlKey;
        if (append) {
          box.toggleClass('selected');
        } else {
          box.parent().find('.selected').removeClass('selected');
          box.addClass('selected');
        }
      }).on('dragstart', 'img', function(e) {
        var box = $(this).parent(), append = e.ctrlKey;
        if (!box.is('.selected')) {
          if (!append) {
            box.parent().find('.selected').removeClass('selected');
          }
          box.addClass('selected');
        }
        drag = true;
      }).on('dblclick','img',function(){
        var img = $(this), box = img.parent();
        viewer = new Viewer(box.parent()[0], {
          navbar: false,
          toolbar: toolbar,
          initialViewIndex: box.index(),
          hidden: function() {
            viewer.destroy();
          }
        });
        viewer.show();
      });

      $('#setFolderBtn').click(setLocalFolder);
      $('#refreshBtn').click(getLocalFiles);
    }
    $('#localFileBtn').click(function(){
      if(fso){
        $fileBar.hide();
        $playBar.hide();
        $imageView.hide().next().hide();
        $fileView.hide();
        $localFileBar.show();
        $path.html(localDir||'').prev().show();
        $localFileList.show();
      } else{
        layer.msg('您还没有配置浏览器设置,请下载处理文件执行后再试(仅IE支持)',{
          icon: 6
        });
        var iframe = $('#downloadForm').children();
        if(iframe.length) {
          iframe.attr('src', basePath+'/static/一键设置IE浏览器.rar')
        } else {
          $('#downloadForm').append('<iframe src="'+basePath+'/static/一键设置IE浏览器.rar" style="display:none"><iframe>')
        }
      }
    });
  } else {
    $('#localFileBtn').hide();
  }

  $localFileBar.hide();
  $localFileList.hide();
  
  $('#downloadBtn').click(function(){
    var url = $path.attr('data-url');
    if(url){
      $('#downloadForm').attr('action', url).submit();
    }
  });
  
  $('#viewTypeBtn').click(function(){
    var icon = $(this).children();
    if(icon.is('.fa-th')){
      icon.removeClass('fa-th').addClass('fa-tv');
      $imageView.show().next().hide();
      $fileView.hide();
      $playBar.hide();
    } else {
      icon.removeClass('fa-tv').addClass('fa-th');
      var t = $path.html().split('.').pop().toLocaleLowerCase();
      if(t == 'pdf' || t=='doc' || t=='docx' || t=='wps'){
        $imageView.hide().next().hide();
        $fileView.show();
        $playBar.show();
      } else {
        $imageView.show().next().show();
      }
    }
  });
  
  $('#prevBtn').click(function(){
    if(imageViewer.index == 0){
      imageViewer.view(imageViewer.images.length-1);
    } else {
      imageViewer.prev();
    }
  });
  
  $('#nextBtn').click(function(){
    if(imageViewer.index == (imageViewer.images.length-1)){
      imageViewer.view(0);
    } else {
      imageViewer.next();
    }
  });
  
  $imageView.on('click','.img-box',function(){
    imageViewer.view($imageView.find('img').index($(this).children('img')));
  }).on('dragstart', 'img', function(e){
    e.stopPropagation();
    e.preventDefault();
  });
});

/**
 * 设置本地文件夹
 *
 * @returns
 */
function setLocalFolder() {
  try {
    var Shell = new ActiveXObject("Shell.Application");
    var Folder = Shell.BrowseForFolder(0, '请选择加载本地图片路径', 0x0201, 12);
    if (Folder != null) {
      Folder = Folder.items().item().Path;
      if (Folder.substr(Folder.length - 1) != '\\') {
        Folder += '\\';
      }
      if (localStorage) {
        localStorage.localDir = Folder;
      }
      localDir = Folder;
      $('#path').html(Folder).attr('title', Folder);
    }
    getLocalFiles();
  } catch (e) {
  }
}

/**
 * 获取本地文件
 *
 * @returns
 */
function getLocalFiles() {
  if (!(localDir && fso)) {
    return;
  }
  var $div = $('#localFileList'),dom = [], dir = fso.GetFolder(localDir), it = new Enumerator(dir.Files), pdfIcon = basePath + '/static/image/', f, type;
  $div.empty();
  while (!it.atEnd()) {
    f = it.item();
    type = f.Name.split('.').pop().toLocaleLowerCase();
    if (('jpg' == type || 'jpeg' == type || 'png' == type) && f.size < pSize) {
      dom.push('<span class="img-box"><img src="file:///');
      dom.push(f.Path);
      dom.push('" alt="');
      dom.push(f.Name);
      dom.push('"><label>');
      dom.push(f.Name);
      dom.push('</label></span>');
    } else if (image[type] && f.size < fSize) {
      dom.push('<span class="img-box"><img src="');
      dom.push(pdfIcon);
      dom.push(image[type]);
      dom.push('" alt="');
      dom.push(f.Name);
      dom.push('"><label>');
      dom.push(f.Name);
      dom.push('</label></span>');
    }
    it.moveNext();
  }
  $div.html(dom.join(''));
}

function base64ToBlob(data, filename) {
  var bytes = window.atob(data), ab = new ArrayBuffer(bytes.length), ia = new Uint8Array(ab);
  for (var i = 0; i < bytes.length; i++) {
    ia[i] = bytes.charCodeAt(i);
  }
  return new Blob([ ab ], {
    type : contentType[filename.split('.').pop()]
  });
}
