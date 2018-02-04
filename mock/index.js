const fs = require("fs");
const http = require("http");
const path = require("path");
const Mock = require('mockjs');
const vm = require('vm')

const methods = {
    files:[],
    baseJsonSrc:'./mock/jsons/',
    //递归目录拼写文件路径并将路径保存到files
    spellingFilePath: dir => {
        const f = fs.readdirSync( path.join( methods.baseJsonSrc, dir ) );

        f.forEach(name => {
            const stats = fs.statSync( path.join( methods.baseJsonSrc, dir, name ) );

            stats.isDirectory() ? 
            methods.spellingFilePath( path.join( dir, name ) ) :
            methods.files.push( path.join( dir, name ).replace( path.sep, "/" ) );
        })
    },
    //解析改变Mock的函数
    changeMockFunction(obj,req){   
        for(let k in obj){
            if( typeof obj[k] == 'object'  ){
                methods.changeMockFunction(obj[k], req);
            }else if( typeof obj[k] == 'function' ){
                obj[k] = obj[k]( { _req:req, Mock:Mock } );
            }
        }
    },
    //利用vm解析mock的json
    vmParseMock(fileSrc){
        let vmContextBox = {};
        vm.runInNewContext(`(function(console,Mock,require){
            const util = require("util");

            oldData = ${fs.readFileSync( path.resolve(methods.baseJsonSrc,'./'+fileSrc) ).toString()};
            setFunction(oldData);
            function setFunction(obj){     
                for(let k in obj){
                    if( typeof obj[k] == 'object'  ){
                        setFunction(obj[k]);
                    }else if( typeof obj[k] == 'function' ){
                        const a = obj[k];
                        obj[k] = ()=>a;
                    }
                }
            }

            data = Mock.mock(oldData)
        });`, vmContextBox)(console,Mock,require);
        return vmContextBox.data;
    },
    parseReturnMock(req,res){
        let fileSrc =  req.url.replace('/','')+'.json';
        console.log(fileSrc);
        if( methods.files.indexOf(fileSrc)!==-1 ){

            let returnData = methods.vmParseMock(fileSrc);
            methods.changeMockFunction(returnData,req);

            res.writeHead(200,{ "Content-Type":"application/json; charset=utf-8" });
            setTimeout( ()=>res.end( JSON.stringify( returnData ) ) ,500);
        }else{
            res.writeHead(404);
            res.end('404 not fount');
        }
    }
}

methods.spellingFilePath('./');

(function(){
    var timer = null;
    //监听目录改变重置 files
    fs.watch( methods.baseJsonSrc,{
        recursive:true
    },function(){
        clearTimeout(timer);
        timer = setTimeout(()=>{
            console.log(arguments[1],'我改变了哈哈');
            methods.files = [];
            methods.spellingFilePath('./'); 
        },100)
    })
})();

const server = http.createServer(function(req,res){
    if(req.url == '/favicon.ico'){ res.end(); return; }

    let length = 0;
    let chunks = [];

    req.on("data",chunk=>{
        chunks.push(chunk);
        length+=chunk.length;
    })

    req.on("end",()=>{
        req.body = length ? JSON.parse( Buffer.concat(chunks,length ).toString() ) : {};

        try{
            methods.parseReturnMock(req,res);
        }catch(err){
            console.error(`错误: ${err}`);
            res.end();
        }
    })
}).listen(5000);

process.on('uncaughtException', (err) => {
    console.error(`错误: ${err}`);
});


