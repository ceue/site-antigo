<? header('Content-Type: text/xml;charset=utf-8');
echo "<?xml version='1.0' encoding='UTF-8' standalone='yes' ?>\n";

 $HTTP_SESSION_VARS["error_message"]="";
 $_SESSION["error_message"]="";
 
$info_error="";
function myErrorHandler($errno, $errstr, $errfile, $errline)
{
  switch ($errno) 
  {
  case E_USER_WARNING:
  $error_message = "[$errno] $errstr";
   break;
  case E_USER_NOTICE:
    $error_message = "[$errno] $errstr";
   break;
  default:
    $error_message = "[$errno] $errstr";
   break;
  }
  setError($error_message);
}

set_error_handler("myErrorHandler");
///////////////////////////////////////////////////////////////////////////////////////////////
// $server_name = $HTTP_SERVER_VARS['SERVER_NAME'];

 $tbl_comment_name="cariboost_tbl_blog_comment";

{
	$predefined_message_error_connect="can't connect to sql database";
	$predefined_message_error_create_db="can't create sql database";
	
	include("./cariboost_private/connexion.inc.php");

   	if (mysql_connect($reserved_sql_host,$reserved_sql_login,$reserved_sql_password)==false)
   	{
		if ($reserved_sql_host=="localhost")
		{
			$info_error = "Can't connect to SQL Database host '".$reserved_sql_host."' , Check your SQL settings";
		}
		else
		{
			$info_error = "Can't connect to SQL Database host '".$reserved_sql_host."' , try 'localhost' and check your SQL settings";
		}
		
		
		
   		//setError("Can't SQL connect");
   	}
   	else
   	{
	       if (mysql_select_db($reserved_sql_database)==false)
	       {
	       		if ($reserved_sql_can_create_database==1)
			{
		       		if (createDatabase($reserved_sql_database))
		       		{
		       			if (mysql_select_db($reserved_sql_database)==false)
		       			{
		       				$info_error = "Can't select database '".$reserved_sql_database."'";
		       			}
		       		}
		       		else
		       		{
		       			$info_error = "Error creating SQL database '".$reserved_sql_database."'";
		       		}				
			}				
	       } 
	}
}

?>
<is_blogslike>
<?


function setError($str) 
{
	$HTTP_SESSION_VARS["error_message"]=strip_tags(convertStringToAscii($str));
	$_SESSION["error_message"]=strip_tags(convertStringToAscii($str));
}

function convertStringToAscii($str) 
{
	$encode="";
	for ($i=0;$i<strlen($str);$i++) 
	{
		$car = ord($str[$i]);
		$car2=chr($car);
		if (  ($car==ord('ê')) ||($car==ord('é')) || ($car==ord('è')) || ($car==ord('ë'))   ) //e
		{
			$car2="e";
		}
		else
		if ($car==ord('ô')) //c
		{
			$car2="o";
		}		
		else
		if ($car==ord('ç')) //c
		{
			$car2="c";
		}
		else
		if ($car==ord('ï')) //c
		{
			$car2="i";
		}		
		else
		if (  (($car>=192) && ($car<=198)) ||  (($car>=224) && ($car<=230))   ) //a
		{
			$car2="a";
		}
		else
		if (  (($car>=192) && ($car<=198)) ||  (($car>=224) && ($car<=230))   )
		{
			$car2="a";
		}						
		$encode=$encode . $car2;
	
	}
  	 return $encode;

}

function doRequestRetrieveComments($tbl_comment_name,$id_article)
{
	$sql_where ="";
	if ($id_article!="")
	{
		$sql_where =" where id_article = '".$id_article."' ";
	}
	
	$sql="SELECT id_comment,key_site,id_article,name,comment,author,email,created FROM ".$tbl_comment_name." ".$sql_where." order by created DESC";
	$req = mysql_query($sql);
	if ($req)
	{
		while($data = mysql_fetch_assoc($req)) 
		{
			$author = $data['author'];
			$comment = $data['comment'];
			$email = $data['email'];
			if ($email=="undefined")
			{
				$email = "";
			}
			

			$author = filterText($author);
			$comment = filterText($comment);
			$comment = str_replace("/br/","\n",$comment);
			
			$email = filterText($email);

			echo "<OBJECT>\n";
			
			echo "<id_article val=\"".$data['id_article']."\"/>";
			echo "<key_site val=\"".$data['key_site']."\"/>";
			echo "<id_comment val=\"".$data['id_comment']."\"/>";
			echo "<email val=\"".$email."\"/>";
			echo "<author val=\"".$author."\"/>";
			echo "<created val=\"".$data['created']."\"/>";
			echo "<comment val=\"".$comment."\"/>";
			
			echo "</OBJECT>\n";
		}
		return true;
	}	
	return false;
}

function doRequestCountComments($tbl_comment_name,$id_article)
{
	$sql="SELECT count(id_article) FROM ".$tbl_comment_name." where id_article = '".$id_article."'";
	$req = mysql_query($sql);
	if ($req)
	{		
		$count = mysql_result($req,0,0); 
		echo "<counter_".$id_article.">".$count."</counter_".$id_article.">";
		return true;
	}	
	return false;
}

function createDatabase($reserved_sql_database)
{
		$sql_create_database = "CREATE DATABASE `".$reserved_sql_database."`;";
		$req = mysql_query($sql_create_database);
		if ($req)
		{
			return true;
		}
	return false;
}
	
function createTable($tbl_comment_name)
{
	$sql_create_tbl_comment = "CREATE TABLE `".$tbl_comment_name."` (`ID_ARTICLE` varchar(20) NOT NULL default '0',`ID_COMMENT` bigint(20) NOT NULL auto_increment,`NAME` text NOT NULL default '',`AUTHOR` text NOT NULL default '',`COMMENT` text NOT NULL,`EMAIL` text NOT NULL default '',`CREATED` datetime NOT NULL, `KEY_SITE` varchar(10) NOT NULL,PRIMARY KEY  (`ID_COMMENT`),KEY `ID_ARTICLE` (`ID_ARTICLE`));";
	$req = mysql_query($sql_create_tbl_comment);
	if ($req)
	{
		return true;
	}
	else
	{
		return false;
	}
}
function addComment($tbl_comment_name,$id_article,$comments,$author,$key_site,$email)
{
	/*
	$id_article =encodeToHtmlText($id_article,false,false);
	$comments =encodeToHtmlText($comments,false,false);
	$author =encodeToHtmlText($author,false,false);
	$email =encodeToHtmlText($email,false,false);
	
	$id_article = str_replace("'"," ",$id_article);
	$comments = str_replace("'"," ",$comments);
	$author = str_replace("'"," ",$author);
	$email = str_replace("'"," ",$email);
	*/
	$today = getdate();
	$s_date = date("Y-m-d H:i:s",mktime($today['hours'], $today['minutes'], $today['seconds'], $today['mon'], $today['mday'], $today['year']));
	$sql_add_comment = "INSERT INTO ".$tbl_comment_name." ( `ID_ARTICLE` , `ID_COMMENT` , `NAME` , `COMMENT` , `EMAIL` , `CREATED` , `AUTHOR` ,`KEY_SITE`) VALUES (\"".$id_article."\", '', '', \"".$comments."\", \"".$email."\", \"".$s_date."\",\"".$author."\",\"".$key_site."\")";
	$req = mysql_query($sql_add_comment);
	if ($req)
	{
		return true;
	}
	return false;	
}

function lastIndexOf($text,$search)
{
	$first_pos = -1;
	for ($i=0; $i<count($search); $i++) 
	{
		$pos = strrpos($text,$search[$i]);
		if (($pos>0)&&($pos>$first_pos))
		{
			$first_pos = $pos;
		}
	}
}
function filterText($text)
{
	$text = htmlspecialchars($text);
	/*
	htmlspecialchars
	$text = str_replace("\"","\\\"",$text);
	$text = str_replace("<"," ",$text);
	$text = str_replace(">","\\\"",$text);
	*/
	/*
	$text = preg_replace("'&#([\d]+);'e"," '&#'.sprintf('%d',(intval('\\1',10)>65535)?63:intval('\\1',10)).';';", $text);
	$pos1 = strrpos($text,"&");
	$pos2 = strrpos($text,";");
	if ($pos1>0)
	{
		$pos3 = strpos($text,'&#38;',$pos1);
		if (($pos2==0)||($pos2>$pos1)||($pos1==$pos3))
		{
			return $text;
		}
		else
		{
			return substr($text,0,$pos1);
		}
	}
	*/
	return $text;
}

function encodeToHtmlText($text,$b_encodeSpace,$b_encodeBreakReturn)
{
	//htmlspecialchars 
	$html="";
	for ($i = 0;$i<strlen($text);$i++)
	{
		$car=ord($text[$i]);
		if (($car == ord('<'))&&(substr($text,$i,4)=="<br>"))
		{
			$html.="/br/";
			$i+=3;
		}
		else
		{
			if ($b_encodeSpace && ($car==32))
			{
				$html.="&nbsp;";
			}
			else
			if (($car>125)||($car == 38)||($car == ord('\''))||($car == ord('<'))||($car == ord('>'))||($car==ord('"'))||($car == ord('+')))
			{
				$html.="&#".sprintf("%d",$car).";";
			}
			else		
			{
				$html.=$text[$i];
			}
		}
	}
	$html = preg_replace("/%u2b/","+", $html);
	
	//$html = preg_replace("'%u(\d+)'e"," '&#'.sprintf('%d',intval('\\1',16)).';';", $html);
	$html = preg_replace("'%u([\d|a|b|c|d|e|f]+)'e"," '&#'.sprintf('%d',intval('\\1',16)).';';", $html);
	return $html;
}

///////////////////////////////////

$result="false";
$action = ((isset($HTTP_GET_VARS['action']))?$HTTP_GET_VARS['action']:$_GET['action']);

if (((isset($HTTP_SESSION_VARS['error_message']))?$HTTP_SESSION_VARS['error_message']:$_SESSION['error_message'])!="")
{	
	
}
else
if ($action=="post_comment")
{
	$id_article= ((isset($HTTP_POST_VARS['id_article']))?$HTTP_POST_VARS['id_article']:$_POST['id_article']);
	$comments= ((isset($HTTP_POST_VARS['comments']))?$HTTP_POST_VARS['comments']:$_POST['comments']);
	$author= ((isset($HTTP_POST_VARS['author']))?$HTTP_POST_VARS['author']:$_POST['author']);
	$key_site= ((isset($HTTP_POST_VARS['key_site']))?$HTTP_POST_VARS['key_site']:$_POST['key_site']);
	$email= ((isset($HTTP_POST_VARS['email']))?$HTTP_POST_VARS['email']:$_POST['email']);
	if ($email=="undefined")
	{
		$email = "";
	}
	if (addComment($tbl_comment_name,$id_article,$comments,$author,$key_site,$email)==true)
	{
		$result="true";
	}
}
else
if ($action=="delete_comment")
{
	$list_id= ((isset($HTTP_GET_VARS['id_comment']))?$HTTP_GET_VARS['id_comment']:$_GET['id_comment']);
	$spec_id= ((isset($HTTP_GET_VARS['id']))?$HTTP_GET_VARS['id']:$_GET['id']);
	
	if ($spec_id==$reserved_sql_special_identifier)
	{
		$words = explode(",", $list_id.",");
		foreach ($words as $val)
		{
			if (strlen($val)>0)
			{
				$sql="DELETE FROM ".$tbl_comment_name." where id_comment=".$val;
				$req = mysql_query($sql);
				if ($req)
				{		
				$result="true";
				}
			}
		}
	}	
}
else
if ($action=="move_comment")
{
	$list_id= ((isset($HTTP_GET_VARS['id_comment']))?$HTTP_GET_VARS['id_comment']:$_GET['id_comment']);
	$spec_id= ((isset($HTTP_GET_VARS['id']))?$HTTP_GET_VARS['id']:$_GET['id']);
	$article_id= ((isset($HTTP_GET_VARS['id_article']))?$HTTP_GET_VARS['id_article']:$_GET['id_article']);
	$site_id= ((isset($HTTP_GET_VARS['id_site']))?$HTTP_GET_VARS['id_site']:$_GET['id_site']);
	
	
	if ($spec_id==$reserved_sql_special_identifier)
	{
		$words = explode(",", $list_id.",");
		foreach ($words as $val)
		{
			
			if (strlen($val)>0)
			{
				//echo $article_id." ".$site_id." ".$val."<br>";
				$sql="UPDATE `".$tbl_comment_name."` SET `ID_ARTICLE` = '".$article_id."', `KEY_SITE` = '".$site_id."' WHERE `ID_COMMENT` = ".$val." LIMIT 1;";
				$req = mysql_query($sql);
				if ($req)
				{		
					$result="true";
				}
			}
		}
	}	
}
else
if ($action=="delete_all_comments")
{
	$id_article= ((isset($HTTP_POST_VARS['id_article']))?$HTTP_POST_VARS['id_article']:$_POST['id_article']);
}
else
if ($action=="refresh_counter_comments")
{
	$list_id="";
	if (array_key_exists('list_id',$HTTP_GET_VARS)||array_key_exists('list_id',$_GET)) 
	{
		$list_id= ((isset($HTTP_GET_VARS['list_id']))?$HTTP_GET_VARS['list_id']:$_GET['list_id']);
	}
	else
	if (array_key_exists('list_id',$HTTP_POST_VARS)||array_key_exists('list_id',$_POST)) 
	{
		$list_id= ((isset($HTTP_POST_VARS['list_id']))?$HTTP_POST_VARS['list_id']:$_POST['list_id']);
	}
	echo "<counter_comments>";
	$words = explode(",", $list_id.",");
	foreach ($words as $val)
	{
		if (strlen($val)>0)
		{
			if (doRequestCountComments($tbl_comment_name,$val)==true)
			{
				$result="true";
			}
			else
			{
				if (createTable($tbl_comment_name))
				{
					if (doRequestCountComments($tbl_comment_name,$val)==true)
					{
						$result="true";
					}
				}			
			}
		}
		
	}
	echo "</counter_comments>";	
}
else
if ($action=="get_comments")
{
	$list_id="";
	if (array_key_exists('list_id',$HTTP_GET_VARS)||array_key_exists('list_id',$_GET)) 
	{
		$list_id= ((isset($HTTP_GET_VARS['list_id']))?$HTTP_GET_VARS['list_id']:$_GET['list_id']);
	}
	else
	if (array_key_exists('list_id',$HTTP_POST_VARS)||array_key_exists('list_id',$_POST)) 
	{
		$list_id= ((isset($HTTP_POST_VARS['list_id']))?$HTTP_POST_VARS['list_id']:$_POST['list_id']);
	}
	
	echo "<comments>\n";
	if ($list_id=="")
	{
		if (doRequestRetrieveComments($tbl_comment_name,"")==true)
		{
			$result="true";
		}		
	}
	else
	{
		
		$list_id =  $list_id.",";
		$words = explode(",", $list_id.",");
		foreach ($words as $val)
		{
			if (strlen($val)>0)
			{
				if (doRequestRetrieveComments($tbl_comment_name,$val)==true)
				{
					$result="true";
				}
			}
		}		
	}
	echo "</comments>\n";	
}

$s_error_message=((isset($HTTP_SESSION_VARS['error_message']))?$HTTP_SESSION_VARS['error_message']:$_SESSION['error_message']);

if ($s_error_message!="")
{	
	$result="false";
}

if ($result=="false")
{
	
	if ($s_error_message=="")
	{
		setError(mysql_error());
	}
	
	
	echo "<error val=\"".$info_error." ".$s_error_message."\">";	
	echo $info_error." ".$s_error_message;	
	echo "</error>";	
}
?>

<result>
<?print($result);?>
</result>

<result_operation val="<?print($result);?>"/>
</is_blogslike>

