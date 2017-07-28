function readSolFile(path, cb)
{
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", path, false);
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
                var allText = rawFile.responseText;
                cb(allText);
            }
        }
    }
    rawFile.send(null);
}