
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
<div class="logincard longCard">
    <div class="pmd-card card-default pmd-z-depth">
        <div class="login-card">
            <form class="form-horizontal" role="form" method="POST" action="{{ url('/adminregister') }}">
                        {{ csrf_field() }}

                <div class="pmd-card-title card-header-border text-center">
                    <div class="loginlogo">
                        <a href="javascript:void(0);"><img src="themes/images/logo-icon.png" alt="Logo" class="logo"></a>
                    </div>
                    <h3>Sign In <span>with <strong>JOBTIVITY</strong></span></h3>
                </div>
                
                <div class="pmd-card-body">
                    <div class="alert alert-success" role="alert"> Oh snap! Change a few things up and try submitting again. </div>

                    <div class="form-group pmd-textfield pmd-textfield-floating-label{{ $errors->has('name') ? ' has-error' : '' }}">
                        <label for="inputError1" class="control-label pmd-input-group-label">Name</label>
                        <div class="input-group">
                            <div class="input-group-addon"><i class="material-icons md-dark pmd-sm">perm_identity</i></div>
                            <input type="text" class="form-control" id="name" name="name" value="{{ old('name') }}" required autofocus>
                             @if ($errors->has('name'))
                                    <span class="help-block">
                                        <strong>{{ $errors->first('name') }}</strong>
                                    </span>
                                @endif
                        </div>
                    </div>

                    <div class="form-group pmd-textfield pmd-textfield-floating-label">
                        <label for="inputError1" class="control-label pmd-input-group-label">Email</label>
                        <div class="input-group">
                            <div class="input-group-addon"><i class="material-icons md-dark pmd-sm">perm_identity</i></div>
                            <input type="text" class="form-control" id="email" name="email" value="{{ old('email') }}" required>
                             @if ($errors->has('email'))
                                    <span class="help-block">
                                        <strong>{{ $errors->first('email') }}</strong>
                                    </span>
                            @endif
                        </div>
                    </div>

                    <div class="form-group pmd-textfield pmd-textfield-floating-label">
                        <label for="inputError1" class="control-label pmd-input-group-label">Contact</label>
                        <div class="input-group">
                            <div class="input-group-addon"><i class="material-icons md-dark pmd-sm">perm_identity</i></div>
                            <input type="text" class="form-control" id="contact" name="contact" value="{{ old('contact') }}" required>
                        </div>
                    </div>
                    
                    <div class="form-group pmd-textfield pmd-textfield-floating-label{{ $errors->has('password') ? ' has-error' : '' }}">
                        <label for="inputError1" class="control-label pmd-input-group-label">Password</label>
                        <div class="input-group">
                            <div class="input-group-addon"><i class="material-icons md-dark pmd-sm">lock_outline</i></div>
                            <input type="text" class="form-control" id="password" name="password" required>
                            @if ($errors->has('password'))
                                    <span class="help-block">
                                        <strong>{{ $errors->first('password') }}</strong>
                                    </span>
                                @endif
                        </div>
                    </div>

                    <div class="form-group pmd-textfield pmd-textfield-floating-label">
                        <label for="inputError1" class="control-label pmd-input-group-label">Confirm Password</label>
                        <div class="input-group">
                            <div class="input-group-addon"><i class="material-icons md-dark pmd-sm">lock_outline</i></div>
                            <input id="password-confirm" type="text" class="form-control" name="password_confirmation" required>
                        </div>
                    </div>
                </div>
                <div class="pmd-card-footer card-footer-no-border card-footer-p16 text-center">
                    <div class="form-group clearfix">
                        <!-- <div class="checkbox pull-left">
                            <label class="pmd-checkbox checkbox-pmd-ripple-effect">
                                <input type="checkbox" checked="" value="">
                                <span class="pmd-checkbox"> Remember me</span>
                            </label>
                        </div>
                        <span class="pull-right forgot-password">
                            <a href="javascript:void(0);">Forgot password?</a>
                        </span> -->
                    </div>
                    <button type="submit" class="btn btn-success btn-block">
                        Register
                    </button>
                    
                    <p class="redirection-link">Don't have an account? <a href="javascript:void(0);" class="login-register">Sign Up</a>. </p>
                    
                </div>
                
            </form>
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
            $('.forgot-password-card').hide();
            $('.register-card').show();
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
