<? header('Content-Type: text/html;charset=utf-8');

function varPost($key)
{
	return ((isset($HTTP_POST_VARS[$key]))?$HTTP_POST_VARS[$key]:$_POST[$key]);
}

function varGet($key)
{
	return ((isset($HTTP_GET_VARS[$key]))?$HTTP_GET_VARS[$key]:$_GET[$key]);
}

function varServer($key)
{
	return ((isset($HTTP_SERVER[$key]))?$HTTP_SERVER[$key]:$_SERVER[$key]);
}

function varPostUtf8($key)
{
	$val=varPost($key);
	$val = str_replace("\\\"","\"",$val);
	return $val;
}

$crbst_action=varPost('crbst_action');

if ($crbst_action == "check_php")
{
?>check_php=<?echo('true');?>&<?
}
else
{
	$array_info_url = parse_url(varServer("HTTP_REFERER"));
	$SITE_REFERER = $array_info_url['host'];
	
	$send_copy_email_to_buyer=varPost('send_copy_email_to_buyer');
	
	$MAIL_TITLE_PREFIXE = varPostUtf8('MAIL_TITLE_PREFIXE');
	$MAIN_TITLE = varPostUtf8('MAIN_TITLE');
	$PREFIXE_ORDER = varPostUtf8('PREFIXE_ORDER');
	$ID_ORDER = varPostUtf8('ID_ORDER');
	$CARD_TITLE = varPostUtf8('CARD_TITLE');
	$LABEL_TYPE_PAYMENT = varPostUtf8('LABEL_TYPE_PAYMENT');
	$TYPE_PAYMENT = varPostUtf8('TYPE_PAYMENT');
	
	$MESSAGE_CHECK = varPostUtf8('MESSAGE_CHECK');
	$MESSAGE_WIRE = varPostUtf8('MESSAGE_WIRE');
	$LABEL_PRINT = varPostUtf8('LABEL_PRINT');
	
	$card_html = varPostUtf8('card_html');
	$card_plain_text = varPostUtf8('card_plain_text');
	$type_payment=varPost('type_payment');
	$email_buyer=varPost('email_buyer');
	$email='';
	$LABEL_SELLER_INFORMATION=varPostUtf8('LABEL_SELLER_INFORMATION');
	$seller_address=varPostUtf8('seller_address');
	$bank_account_informations=varPostUtf8('bank_account_informations');
	$MARKET_BUYER_INFO_SHIPPING=varPostUtf8('buyer_info_shipping');
	$MARKET_BUYER_INFO_BILLING=varPostUtf8('buyer_info_billing');
	
	//send email!
	$email_title = $MAIL_TITLE_PREFIXE." ".$ID_ORDER." (".$TYPE_PAYMENT.")";
	
	$txt_mail="";
	$txt_mail.= $PREFIXE_ORDER." ".$ID_ORDER." (".$TYPE_PAYMENT.")\n";
	$txt_mail.= "From:\n";
	$txt_mail.= $SITE_REFERER;
	$txt_mail.= "\n";
	$txt_mail.= $CARD_TITLE;
	$txt_mail.= "\n";
	$txt_mail.= $card_plain_text;
	$txt_mail.= "\n";
	$txt_mail.= "------------------------\n";
	$txt_mail.= $LABEL_SELLER_INFORMATION."\n";

	if ($type_payment=='wire')
	{
		$txt_mail.= $LABEL_BANK_ACCOUNT."\n";
		$txt_mail.= $bank_account_informations;
		$txt_mail.= "\n";
	}
	$txt_mail.= $LABEL_ADDRESS."\n";
	$txt_mail.= $seller_address;
	$txt_mail.= "\n";
		
	$txt_mail.= "------------------------\n";
	$txt_mail.= $MARKET_BUYER_INFO_SHIPPING;
	$txt_mail.= "\n";
	$txt_mail.= $MARKET_BUYER_INFO_BILLING;
	$txt_mail.= "\n";
		
	$header = "";
//	$header  = "From:nom@domaine.com\n";
	$header .= "Content-type: text/plain; charset= utf-8\n";
	$header .= "From:".$email."\n";
	$header .= "Return-Path:".$email."\n";
	$header .= "MIME-version: 1.0\n";

	$result_email = @mail($email,$email_title,$txt_mail,$header);
	
	if ($send_copy_email_to_buyer=="1")
	{
		@mail($email_buyer,$email_title,$txt_mail,$header);
	}
	//
	
	/////
	$seller_address = str_replace("\n","<br>",$seller_address);
	$bank_account_informations = str_replace("\n","<br>",$bank_account_informations);
	$MARKET_BUYER_INFO_SHIPPING = str_replace("\n","<br>",$MARKET_BUYER_INFO_SHIPPING);
	$MARKET_BUYER_INFO_BILLING = str_replace("\n","<br>",$MARKET_BUYER_INFO_BILLING);
	/////
	if ($type_payment=="check")
	{
			?>
			<html>
<head>
	<meta content="text/html; charset=UTF-8" http-equiv="content-type">
	<!-- tag MAIN_TITLE-->
	<title><?echo($MAIN_TITLE);?></title>
	<style>
	.crbst-table-title{background-color:rgb(214, 232, 243);;}
	.crbst-card-total{font-weight: bold;font-size:15pt;;}
	.crbst-buyer-info{font-weight: normal;font-size:11pt;vertical-align: top;width:200px;;}
	</style>
</head>
<body>
<div style="text-align: center;">
<span style="font-size:16pt;font-family:Arial;font-weight: bold;"><!-- tag MAIN_TITLE--><?echo($MAIN_TITLE);?></span>

<br>
<br>
<table style="width:400px; height: 29px; text-align: left; margin-left: auto; margin-right: auto;" border="1" cellpadding="2" cellspacing="2">
	<tr>
		<td style="text-align: center; vertical-align: middle; background-color: rgb(214, 232, 243);">
			<span style="font-family: Arial;"><!-- tag PREFIXE_ORDER--><?echo($PREFIXE_ORDER);?></span>
			<span style="font-weight: bold;"><!-- tag ID_ORDER--><?echo($ID_ORDER);?></span>
		</td>
	</tr>
</table>
<br>
<br>
<span style="font-family: Arial;"><!-- tag CARD_TITLE--><?echo($CARD_TITLE);?> :</span>
<br>
<br>

<!--begin card-->
<table style="width:607px;text-align: left; margin-left: auto; margin-right: auto;">
	<tr>
		<td>
<!-- begin tag-->
<!-- tag MARKET_CARD-->
<?echo($card_html);?>			
<!--end card-->

<br>
<table style="width:607px;text-align: left; margin-left: auto; margin-right: auto;;">
	<tr>
		<td >
			<table border=0>
				<tr>
					<td class="crbst-buyer-info">
						<!-- tag MARKET_BUYER_INFO_SHIPPING-->
						<?echo($MARKET_BUYER_INFO_SHIPPING);?>				
					</td>
					<td class="crbst-buyer-info">
						<!-- tag MARKET_BUYER_INFO_BILLING-->	
						<?echo($MARKET_BUYER_INFO_BILLING);?>		
					</td>
				</tr>
			</table>		
		</td>
	</tr>
</table>



<br>
<table style="width:607px;text-align: center; margin-left: auto; margin-right: auto;;">
	<tr>
		<td >
<span style="font-family: Arial;"><!-- tag LABEL_TYPE_PAYMENT--><?echo($LABEL_TYPE_PAYMENT);?> : </span>
<span style="font-weight: bold; color: rgb(255, 0, 0);"><!-- tag TYPE_PAYMENT--><?echo($TYPE_PAYMENT);?></span>
		</td>
	</tr>
	<tr>
		<td >
				<br>
	<span style="font-family:Arial;font-weight:normal;"><!-- tag MESSAGE_CHECK--><?echo($MESSAGE_CHECK);?></span>
		</td>
	</tr>
	
	<tr>
		<td >
				<br>
<span style="font-family: Arial;font-size:13pt;font-weight: bold;">
	<!-- tag MARKET_SELLER_INFO--><?echo($seller_address);?>
</span>
		</td>
	</tr>	
	
		<tr>
			<td >
					<br>
					<!-- tag LABEL_PRINT -->
					<input type="button" value="  <?echo($LABEL_PRINT);?>  " onclick="javascript:window.print()">
			</td>
		</tr>
</table>

</div>
</body>
</html>

			<?		
	}
	
	if ($type_payment=="wire")
	{
			?>
			<html>
<head>
	<meta content="text/html; charset=UTF-8" http-equiv="content-type">
	<!-- tag MAIN_TITLE-->
	<title><?echo($MAIN_TITLE);?></title>
	<style>
	.crbst-table-title{background-color:rgb(214, 232, 243);;}
	.crbst-card-total{font-weight: bold;font-size:15pt;;}
	.crbst-buyer-info{font-weight: normal;font-size:11pt;vertical-align: top;width:200px;;}
	</style>
</head>
<body>
<div style="text-align: center;">
<span style="font-size:16pt;font-family:Arial;font-weight: bold;"><!-- tag MAIN_TITLE--><?echo($MAIN_TITLE);?></span>

<br>
<br>
<table style="width:400px; height: 29px; text-align: left; margin-left: auto; margin-right: auto;" border="1" cellpadding="2" cellspacing="2">
	<tr>
		<td style="text-align: center; vertical-align: middle; background-color: rgb(214, 232, 243);">
			<span style="font-family: Arial;"><!-- tag PREFIXE_ORDER--><?echo($PREFIXE_ORDER);?></span>
			<span style="font-weight: bold;"><!-- tag ID_ORDER--><?echo($ID_ORDER);?></span>
		</td>
	</tr>
</table>
<br>
<br>
<span style="font-family: Arial;"><!-- tag CARD_TITLE--><?echo($CARD_TITLE);?> :</span>
<br>
<br>

<!--begin card-->
<table style="width:607px;text-align: left; margin-left: auto; margin-right: auto;">
	<tr>
		<td>
<!-- begin tag-->
<!-- tag MARKET_CARD-->
<?echo($card_html);?>			
<!--end card-->

<br>
<table style="width:607px;text-align: left; margin-left: auto; margin-right: auto;;">
	<tr>
		<td >
			<table border=0>
				<tr>
					<td class="crbst-buyer-info">
						<!-- tag MARKET_BUYER_INFO_SHIPPING-->
						<?echo($MARKET_BUYER_INFO_SHIPPING);?>				
					</td>
					<td class="crbst-buyer-info">
						<!-- tag MARKET_BUYER_INFO_BILLING-->	
						<?echo($MARKET_BUYER_INFO_BILLING);?>		
					</td>
				</tr>
			</table>		
		</td>
	</tr>
</table>



<br>
<table style="width:607px;text-align: center; margin-left: auto; margin-right: auto;;">
	<tr>
		<td >
<span style="font-family: Arial;"><!-- tag LABEL_TYPE_PAYMENT--><?echo($LABEL_TYPE_PAYMENT);?> : </span>
<span style="font-weight: bold; color: rgb(255, 0, 0);"><!-- tag TYPE_PAYMENT--><?echo($TYPE_PAYMENT);?></span>
		</td>
	</tr>
	<tr>
		<td >
				<br>
	<span style="font-family:Arial;font-weight:normal;"><!-- tag MESSAGE_WIRE--><?echo($MESSAGE_WIRE);?></span>
		</td>
	</tr>
	
	<tr>
		<td >
			<br>
			<span style="font-family: Arial;font-size:13pt;font-weight: bold;">
				<!-- tag MARKET_BANK_INFO--><?echo($bank_account_informations);?>
			</span>
		</td>
	</tr>	
	
	<tr>
		<td >
				<br>
<span style="font-family: Arial;font-size:13pt;font-weight: bold;">
	<!-- tag MARKET_SELLER_INFO--><?echo($seller_address);?>
</span>
		</td>
	</tr>	
	
		<tr>
			<td >
					<br>
					<!-- tag LABEL_PRINT -->
					<input type="button" value="  <?echo($LABEL_PRINT);?>  " onclick="javascript:window.print()">
			</td>
		</tr>
</table>

</div>
</body>
</html>

			<?		
	}
}
?>