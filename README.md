WebGLBook
=========

Code Examples for Tony Parisi's Book, WebGL Up and Running.

You can grab the stable version that corresponds with August 2012 release of the book by getting the tag v1.0 (see Tags).

Please note that currently these examples are based on an older version of Three.js (r46). A snapshot of that 
version is included as libs/Three.js. I am currently working on upgrading to the latest stable Three.js (r50). Thanks
for your patience!

VERY IMPORTANT TECH NOTE: It seems that folks are missing my little tech tip at the bottom of page 19,
in the section titled "Setting up Three.js." These examples *must* be run from a web server such as 
Apache. localhost:// is fine but it needs to be coming from a server or loading external files such as 
textures and JSON for models simply won't work because of browser security restrictions. Or, if you have
Python installed on your machine, you can run the simple web server module and serve up files that way:

cd <path to the example files>
python -m SimpleHTTPServer

Then point your web browser at

http://localhost:8000/

Happy coding!
