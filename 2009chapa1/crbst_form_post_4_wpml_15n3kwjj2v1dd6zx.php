<?php
echo "BEGIN_IS_PHP="."1"."\n";
$text="";
$text.= "Nome\n".((isset($HTTP_POST_VARS['field0']))?$HTTP_POST_VARS['field0']:$_POST['field0'])."\n\n";
$text.= "E-mail\n".((isset($HTTP_POST_VARS['field1']))?$HTTP_POST_VARS['field1']:$_POST['field1'])."\n\n";
$text.= "Assunto\n".((isset($HTTP_POST_VARS['field2']))?$HTTP_POST_VARS['field2']:$_POST['field2'])."\n\n";
$text.= ((isset($HTTP_POST_VARS['field3']))?$HTTP_POST_VARS['field3']:$_POST['field3'])."\n\n";
$destinataire='grace.ufrgs@gmail.com';
$headers='';
$headers.='Content-Type: text/plain; charset="utf-8"\n';
$headers.='From:grace.ufrgs@gmail.com\n';
$headers.='Return-Path:grace.ufrgs@gmail.com\n';
if (@mail($destinataire,"Chapa 1 CEUE",$text,$headers))
{
echo "mail_sended=1\n";
}
else
{
echo "mail_sended=0\n";
}
echo "END_IS_PHP";
?>
