/*
A bunch of useful small functions & shortcuts for JavaScript.
Use at your own risk. See the file ./LICENSE

Guillaume Lathoud, 2016
glat@glat.info
*/

/* getters: pure functions */

function gA( aname, /*?*/node )
{
    return (node  ||  document).getAttribute( aname );
}

function gEBCN( cname, /*?*/node )
{
    return (node  ||  document).getElementsByClassName( cname );
}

function gEBI( id, /*?*/node )
{
    return node  ?  qS( '#' + id, node )  :  document.getElementById( id );
}

function gEBTN( tname, /*?*/node ) 
{
    return (node  ||  document).getElementsByTagName( tname );
}

function gScrollTop( node )
{
    return node  &&  node.offsetParent
	?  (node.offsetTop)  +  gScrollTop( node.offsetParent )
	:  0
    ;
}

function id( x )
{
    return x;
}

function qS( sel, /*?*/node )
{
    return (node  ||  document).querySelector( sel );
}

function qSA( sel, /*?*/node )
{
    return (node  ||  document).querySelectorAll( sel );
}

/* html getters */

function h( /*string, e.g. 'div' or 'div class="myclass"'*/tname, /*string*/html ) 
{
    return html
	?  '<' + tname + '>' + html + '</' + tname.replace( /\s[\S\s].*$/, '' ) + '>'
	:  '<' + tname + '/>'
    ;
}

function hDIV( html ) { return h( 'div', html ); }
function hEM( html )  { return h( 'em', html ); }
function hP ( html )  { return h( 'p',  html ); }

/* creators */

function cE( name, /*?*/node )
{
    return (node  ||  document).createElement( name );
}

/* getter-setters */

function gs( pname, obj, code )
{
    return pname in obj  ?  obj[ pname ]  :  (obj[ pname ] = run( 'return ' + code, obj ));
}

/* modifiers: setters returning their first parameter */

function aEL( node, ename, clientfun, /*?*/capture )
{
    (node  ||  document).addEventListener( ename, clientfun, capture );
}

function sA( node, aname, value )
{
    node.setAttribute( aname, value );
    return node;
}

function sP( node, propname, value )
{
    node[ propname ] = value;
    return node;
}

/* other */

function or( arr, /*?function?*/testfun )
{
    for (var n = arr.length, i = 0; i < n; i++)
    {
        var xi = arr[ i ]
        ,    v = testfun  ?  testfun( xi )  :  xi
        ;
	if (v)
	    return v;
    }
}

function pad( s, n, c )
{
    c  ||  (c = ' ');
    'string' === typeof s  ||  (s = '' + s);

    var arr = s.split( '' ).reverse();

    while (arr.length < n)
	arr.push( c );

    return arr.reverse().join( '' );
}

function fun( code )
{
    return code in fun  ?  fun[ code ]  :  (fun[ code ] = new Function( 'a', 'b', code ); /* a & b are optional */
}

function run( code, /*?*/a, /*?*/b ) 
/* a & b are optional */
{
    return (code in fun  ?  fun[ code ]  :  fun( code ))( a, b );
}

function xhrGetSync( href )
/* yes, as of 2016 "sync" already deprecated, but still useful for quick test purposes */
{
    var xhr = new XMLHttpRequest();
    xhr.open( 'GET', href, false );
    xhr.send();
    return xhr.responseText;
}
