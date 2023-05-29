


@if($status==1)

<b>{{$user_Name}}</b>  just registered as one of your company employees. Please approve or decline his/her registration.

 <br>
 <br>
 <a href="http://jobtivity.adequatedeal.com:83/LaravvelSvnCode/web/auth/verify?id={{$user_Id}}&status=1&type=c">Accept</a> <br>
 <a href="http://jobtivity.adequatedeal.com:83/LaravvelSvnCode/web/auth/verify?id={{$user_Id}}&status=2&type=c">Decline</a>


@endif
@if($status==2)


 <b>{{$user_Name}}</b> just registered as the company administrator for <b> {{$company_name}} </b>. Please approve or decline his/her registration

 <br>
 <br>
 <a href="http://jobtivity.adequatedeal.com:83/LaravvelSvnCode/web/auth/verify?id={{$user_Id}}&status=1&type=u">Accept</a> <br>
 <a href="http://jobtivity.adequatedeal.com:83/LaravvelSvnCode/web/auth/verify?id={{$user_Id}}&status=2&type=u">Decline</a>

@endif

@if($status==3)

Your registration has been accepted by the company administrator. You may now login to Jobtivity.

@endif

@if($status==4)

Your registration has been declined by the company administrator. Please contact them for further details.

@endif

@if($status==5)

Your registration has been accepted. You may now login to Jobtivity.

@endif

@if($status==6)

Your registration has been declined. Please contact us for further details.

@endif

@if($status==7)

Hi {{$name}},

<br>
<br>
You’re receiving this email because you requested a password reset for your Jobtiviti account. 

<br>
<br>
Please login using your temporary password: <b> {{$password}} </b> 

<br>
<br>
Once you login, please change it to your new password. <br>

<br>
Thanks,<br>
The Jobtiviti Team

@endif




