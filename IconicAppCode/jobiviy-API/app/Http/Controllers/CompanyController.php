<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;
use App\Models\User;
use App\Admins\Company;
use App\Models\AgentReferalCodes;
use DB;
use Carbon;
use App\Enums\UserType;
use App\Enums\StatusType; 
use App\Models\Jobtivity;                       
class CompanyController extends Controller 
{
     /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct() {
        //$this->middleware('auth');
    }

 /*
  public function companylistverify(Request $request)
     {
        $list = Company::where('is_verify',[0,1])->get(['id','company_name','is_verify'])->toArray();
        $rt['status'] = 'success';
        $rt['companyList'] = $list;
        return response()->json($rt);
   
     }
*/

    public function companylistbysearch(Request $request)

     {
        $list =null;
        $data = $request->all();
        $prefixs=$data['prefix'];
        $type=$data['type'];
        if($prefixs!=null && !empty($prefixs))
        {
         
          $list = Company::where('is_verify',$type)->where('company_name','LIKE','%'.$prefixs.'%')->get(['id','company_name','is_verify'])->toArray();
        }
        else
        {  

            $list = Company::where('is_verify','=',$type)->get(['id','company_name','is_verify'])->toArray();
        }
       
        $rt['status'] = 'success';
        $rt['companyList'] = $list;
        return response()->json($rt);
     }

    public function updatecompanystatus(Request $request)
     {
          $data = $request->all();

          $company_id=$data['company_id'];
          $type=$data['type'];
          $datacompany=Company::where('id',$company_id)->first();
        if($datacompany!=NULL)
        {
            $datacompany->is_verify = $type;
            $datacompany->save();
                    
          
           $user=User::where(['company_id'=>$company_id,'user_role'=>UserType::CompanyAdmin])->first();
           if($user!=Null)
           {
            $user->is_verified =$type;
            $user->save();
           }
           return response()->json([
                    'data' => '1',
                    'status' => 'success'
            ]);
        }

        return response()->json([
                    'data' => '0',
                    'status' => 'success'
            ]);

     }
      
       public function getSalesAgent(Request $request)

     {
         $data = $request->all();

          $list = User::where(['status'=>StatusType::Active,'user_role'=>UserType::CompanyAdmin])->get(['id','email'])->toArray();
            $rt['status'] = 'success';
           $rt['data']=$list;
        return response()->json($rt);

     }
  
  public function getEmployeeList(Request $request){
           
            $data = $request->all();

           $company_id=$data['company_id'];
         $user=User::where(['company_id'=>$company_id])->whereIn('user_role', [UserType::CompanyAdmin,UserType::CompanyEmployee])->get(['id','name','email','is_verified','company_id'])->toArray();

           $rt['status'] = 'success';
           $rt['data']=array($user);
        return response()->json($rt);
     }
  

  public function SalesAgentRemove(Request $request) {
        
             $data = $request->all();
             $user_id=$data['id'];
             //$api_token=$data['api_token'];
            $user = User::where('id',$user_id)->first();
            if($user!=null)
            {   
                $user->status =StatusType::Remove; 
                $user->save();

                 return response()->json([
                    'data' => 'sales agentRemove Suceesfully'
                   ]);
             } 
    }
   
   public function ValidateToken(Request $request){
         $data = $request->all();
         $email=$data['email'];
         $api_token=$data['api_token'];
        $user=User::where(['email'=>$email,'api_token'=>$api_token])->first();
        if($user!=Null){
          $jotiviti=Jobtivity::where(['user_id'=>$data['user_id']])->first();
          if($jotiviti!=Null){
            // when jobtivity exit then pass in jobtivity in 1 else 0
            return response()->json([
                    'data' => '1',
                    'Jobtivity'=>'1',
                    'status' => 'success'
            ]);
          }else
          {
             return response()->json([
                    'data' => '1',
                    'Jobtivity'=>'0',
                    'status' => 'success'
            ]);

          }
        }else
        {
           return response()->json([
                    'data' => '0',
                    'status' => 'success'
            ]);  
        }
 
      }
    public function GenerateReferalCode(Request $request){

         $data = $request->all();
         $email=$data['email'];
         $user=User::where(['email'=>$email,'user_role'=>UserType::SalesAgent])->first();

         if($user!=null)
         {
             $datacode= AgentReferalCodes::create([
                    'agent_id' => $user['id'],
                    'referal_id' => str_random(6),
                ]);

                $rt['status'] = 'success';
                $rt['data']=$datacode;
              return response()->json($rt);
         }else
         {
              $rt['status'] = 'error';
                $rt['message']='You are Not Registered';
                
            return response()->json($rt);
         }

      }
     public function verifycompanybycode(Request $request){
        $data = $request->all();
        $referal_id=$data['referal_code'];
        $type=$data['type'];
        $company_id=$data['company_id'];
        $generatereferal=AgentReferalCodes::where(['referal_id'=>$referal_id,'company_id'=>null])->first();
        if($generatereferal!=null){
              $date= $generatereferal->created_at;
              $date->modify('+80 minutes');
              $formatted_date = $date->format('Y-m-d H:i:s');
              $mytime = Carbon\Carbon::now();
              $newDate=$mytime.date('Y-m-d H:i:s');
              if($generatereferal->created_at <=$newDate and $formatted_date>=$newDate)
              {

            $generatereferal->company_id= $company_id;
            $generatereferal->save();

            $user=User::where('company_id', $company_id)->first();

            if($user!=null)
            {
                $user->is_verified = $type;
                $user->save();
            }
            $datacompany=Company::where('id',$company_id)->first();
           if($datacompany!=null) {
                $datacompany->is_verify =$type;
                $datacompany->save();
            }
            return response()->json([
                    'data' =>  '1',
                    'status' => 'success'
            ]);
        }
        else
        { 
            return response()->json([
                    'data' => '0',
                    'message'=>'Referal Code is not Valid',
                    'status' => 'error'
            ]);

          }
        }

            return response()->json([
                    'data' => '0',
                    'message'=>'Referal Code is not Valid',
                    'status' => 'error'
            ]);

      }

     
    
}