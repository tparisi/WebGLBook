<?php
     $content = file_get_contents($_GET['url']);
 
     if ($content !== false) 
     {   
     	echo($content);
     } 
     else 
     {  
          // there was an error
     }
?>