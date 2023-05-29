<!--<h1>Please Select a Company
@if(Session::has('tempemail'))
    {{ Session::get('tempemail') }}
@endif
</h1> -->


<!doctype html>
<html lang="">
<head>
<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="description" content="Login | Propeller - Admin Dashboard">
<meta content="width=device-width, initial-scale=1, user-scalable=no" name="viewport">
<title>Jobtivity</title>
<link rel="shortcut icon" href="themes/images/logo-icon.png">

<!-- Google icon -->
<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">

<!-- Bootstrap css -->
<link rel="stylesheet" type="text/css" href="assets/css/bootstrap.min.css">

<!-- Propeller css -->
<link rel="stylesheet" type="text/css" href="assets/css/propeller.min.css">

<!-- Propeller theme css-->
<link rel="stylesheet" type="text/css" href="themes/css/propeller-theme.css" />

<!-- Propeller admin theme css-->
<link rel="stylesheet" type="text/css" href="themes/css/propeller-admin.css">

<!-- Custome Css -->
<link rel="stylesheet" type="text/css" href="assets/css/custom.css">

</head>

<body class="body-custom">
	<div class="logincard longCard" id="logincard1">
	    <div class="pmd-card card-default pmd-z-depth">
	    	<br>
	    	<br><br><br><br><br>
	    	@if(Session::has('message'))
	    	    {{ Session::get('message') }}	    	        	 
            @endif
			<br><br><br><br>

	        <div class="login-card">
	            <form class="form-horizontal" role="form" method="POST" action="{{ action('Admin\CompanyController@store') }}">
	                {{ csrf_field() }}
	                
	                <div class="pmd-card-body">
	                    <div class="alert alert-success" role="alert"> Oh snap! Change a few things up and try submitting again. </div>

	                    <div class="form-group pmd-textfield pmd-textfield-floating-label">       
							<label>Select Comapny</label>
							<select class="select-simple form-control pmd-select2" name="company_id">
								<option>Please Select Your Company</option>
								@foreach($company as $companies)
								<option value="{{$companies->id}}">{{$companies->company_name}}</option>
								@endforeach								
							</select>
						</div>
	                </div>
	                
	                <div class="pmd-card-footer card-footer-no-border card-footer-p16 text-center">
	                    <button type="submit" class="btn btn-success btn-block alert-class">
	                        Done
	                    </button>
	                    
	                    <p class="redirection-link">Unable to find company <a href="javascript:void(0);" class="login-register">Create a new one</a>. </p>
	                    
	                </div>
	                
	            </form>
	        </div>       
	      
	    </div>
	</div>

	<div class="logincard longCard longCard1 hide" id="logincard">
	    <div class="pmd-card card-default pmd-z-depth">
	        <div class="login-card longCard1" >
	            <form class="form-horizontal" role="form" method="POST" action="{{ action('Admin\CompanyController@create') }}">
	                {{ csrf_field() }}
	                
	                <div class="pmd-card-body">
	                    <div class="alert alert-success" role="alert"> Oh snap! Change a few things up and try submitting again. </div>
	                    <div class="group-fields clearfix row">
							<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
								<div class="form-group pmd-textfield pmd-textfield-floating-label">
									<label for="regular1" class="control-label">
										Name
									</label>
									<input type="text" id="company_name" class="form-control" name="company_name">
								</div>
							</div>
						</div>
	                    <div class="form-group pmd-textfield pmd-textfield-floating-label">       
							<label>Select State</label>
							<select class="select-simple form-control pmd-select2" name="state">
								<option></option>
								<option value="1">State</option>
								<option value="2">State</option>
								<option value="3">State</option>
							</select>
						</div>

						<div class="form-group pmd-textfield pmd-textfield-floating-label">       
							<label>Select Industry</label>
							<select class="select-simple form-control pmd-select2" name="industry">
								<option></option>
								<option value="11">Industry</option>
								<option value="22">Industry</option>
								<option value="33">Industry</option>
								
							</select>
						</div>

	                    <div class="form-group pmd-textfield pmd-textfield-floating-label">       
							<label>Size of company</label>
							<input type="text" id="size_of_company" class="form-control" name="size_of_company">
						</div>

	                    <!-- <div class="form-group pmd-textfield pmd-textfield-floating-label">       
							<label>What time commitment does your employee possess?</label>
							<select class="select-simple form-control pmd-select2">
								<option></option>
	                        	<option value="">Option</option>
	                        	<option value="">Option</option>
	                        	<option value="">Option</option>
							</select>
						</div>

						<div class="form-group pmd-textfield pmd-textfield-floating-label">       
							<label>Do you prefer a booksmart or streetsmart people?</label>
							<select class="select-simple form-control pmd-select2">
								<option></option>
	                        	<option value="">Option</option>
	                        	<option value="">Option</option>
	                        	<option value="">Option</option>
							</select>
						</div> -->
	                </div>
	                <div class="pmd-card-footer card-footer-no-border card-footer-p16 text-center">
	                    <button type="submit" class="btn btn-success btn-block">
	                         Set up my company
	                    </button>
	                    
	                    <p class="redirection-link">Comapny already registered? <a href="javascript:void(0);" class="login-register">Select Company</a>. </p>
	                    
	                </div>
	                
	            </form>
	        </div>       
	      
	    </div>
	</div>
</div>



<!-- Scripts Starts -->
<script src="assets/js/jquery-1.12.2.min.js"></script>
<script src="assets/js/bootstrap.min.js"></script>
<script src="assets/js/propeller.min.js"></script>
<script>
    $(document).ready(function() {
        var sPath=window.location.pathname;
        var sPage = sPath.substring(sPath.lastIndexOf('/') + 1);
        $(".pmd-sidebar-nav").each(function(){
            $(this).find("a[href='"+sPage+"']").parents(".dropdown").addClass("open");
            $(this).find("a[href='"+sPage+"']").parents(".dropdown").find('.dropdown-menu').css("display", "block");
            $(this).find("a[href='"+sPage+"']").parents(".dropdown").find('a.dropdown-toggle').addClass("active");
            $(this).find("a[href='"+sPage+"']").addClass("active");
        });
    });
</script>
<!-- login page sections show hide -->
<script type="text/javascript">
    $(document).ready(function(){
     $('.app-list-icon li a').addClass("active");
        $(".login-for").click(function(){
            $('.login-card').hide()
            $('.forgot-password-card').show();
        });
        $(".signin").click(function(){
            $('.login-card').show()
            $('.forgot-password-card').hide();
        });
    });
</script>
<script type="text/javascript">
$(document).ready(function(){
        $(".login-register").click(function(){        	
            $('.login-card').hide()            
            $('.longCard1').show();
            
            $('#logincard1').addClass('hide');
            $('#logincard').removeClass('hide');
        });
        
        $(".register-login").click(function(){
            $('.register-card').hide()
            $('.forgot-password-card').hide();
            $('.login-card').show();
        });
        $(".forgot-password").click(function(){
            $('.login-card').hide()
            $('.register-card').hide()
            $('.forgot-password-card').show();
        }); 
});
</script> 

<!-- Scripts Ends -->

</body>
</html>
