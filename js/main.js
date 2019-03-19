$(document).ready(function(){
    var _url = 'https://my-json-server.typicode.com/kemalhibatullah/latihan-api/mahasiswa';

    //untuk menampung semua data mahasiswa
    var result = '';

    //untuk menampung gender sebagai option diselect
    var gender_result = '';

    //untuk menampung semua gender mahasiswa
    var gender = [];

    //$.get(_url,function (data) {
    function renderPage(data){
        $.each(data, function (key, items){
            _gend = items.gender;

            result += '<div>' +
                '<h3>'+items.name+'</h3>' +
                '<p>'+_gend+'</p>' +
                '</div>';

            if ($.inArray(_gend, gender) === -1){
                gender.push(_gend);
                gender_result += "<option value='"+_gend+"'>"+_gend+"</option>";
            }
        });

        $('#mhs-list').html(result);
        $('#mhs-select').html("<option value='semua'>semua</option>"+gender_result);
        
    }

    var returnDataReceive = false;

    var returnUpdate = fetch(_url).then (function(response) {
        return response.json();
    }).then(function (data){
        returnDataReceive = true;
        renderPage(data);
    });

    caches.match(_url).then(function (response){
        if (!response) throw Error("no data no cache")
        return response.json();
    }).then(function (data){
        if (returnDataReceive){
            renderPage(data);
            console.log("render from data");
        }
    }).catch(function (){
        return returnUpdate;
    })

    $("#mhs-select").on('change', function(){
        updateListMahasiswa($(this).val());
    });

    function updateListMahasiswa(opt){
        var result = '';
        var _url2 = _url;

        if(opt !== 'semua'){
            _url2 = _url + '?gender='+opt;
        }

        $.get(_url2,function (data) {
        
            $.each(data, function (key, items){
                _gend = items.gender;
    
                result += '<div>' +
                    '<h3>'+items.name+'</h3>' +
                    '<p>'+_gend+'</p>' +
                    '</div>';
    
            });
    
            $('#mhs-list').html(result);
            
        });
        
    }

    Notification.requestPermission(function (status){
        console.log('Notif permision status',status)
    });
    function displayNotification(){
        if (Notification.permission === 'granted'){
            navigator.serviceWorker.getRegistration()
            .then(function (reg){
                var options = {
                    body : "Ini adalah notifikasi",
                    icon : "image/g5.png",
                    vibrate : [100,50,100],
                    data : {
                        dateOfArrival : Date.now(),
                        primaryKey : 1
                    },
                    actions : [
                        {action : 'explore',title : 'Kunjungi Situs',
                        icon : 'image/success.png'},
                        {action : 'close',title : 'Tutup Notifikasi',
                        icon : 'image/close.png'},
                    ]
                };
                reg.showNotification('Ini Notifikasi',options)
            })
        }
    }
    $('#show-notification').on('click',function(){
        displayNotification();
    });
    function isOnline(){
        var connectionStatus = $("#online-status");
        if (navigator.onLine) {
            connectionStatus.html = '<p>Anda Online</p>';
        }else{
            connectionStatus.html = '<p>Anda Offline</p>';
        }
    }
    
    window.addEventListener('online',isOnline);
    window.addEventListener('offline',isOnline);
    isOnline();
});

if('serviceWorker' in navigator){
    window.addEventListener('load', function(){
        navigator.serviceWorker.register('/serviceworker.js').then(
            function(reg){
                document.getElementById('load-in-bg')
                .addEventListener('click',()=>{
                    reg.sync.register('image-fetch')
                    .then(()=>{
                        console.log('sync-registered');
                    }).catch((err)=>{
                        console.log('unable to fetch image. err: ',err);
                    })
                })
            }, function(err){
                console.log("Sw registration failed : ", err);
            }
        )
    })
}
