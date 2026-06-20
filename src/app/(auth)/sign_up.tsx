import { useAuth, useSignUp } from '@clerk/expo';
import React from 'react';
import tw from 'twrnc';
import { View, Text, StyleSheet, ScrollView, Image, TextInput,TouchableOpacity,ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import {Link} from 'expo-router';

const SignUp = () => {
  
 const{signUp,errors,fetchStatus}=useSignUp();
 const{isSignedIn}=useAuth();
 const router=useRouter();
  const [firstName, setFirstName] = React.useState('');
  const [lastName, setLastName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [code, setCode] = React.useState('');
  const isLoading=fetchStatus==="fetching";

  if(signUp.status==='complete' || isSignedIn){
    return null;
  }

 


 const onSignUpPress = async () => {
  const {error}=await signUp.password({
    emailAddress:email,
    password,
    firstName,
    lastName,
  })

  if(error){
    alert(error.message);
    return;
  }

  if(!error) await signUp.verifications.sendEmailCode();

 router.push({
  pathname: "/verify_email",
  params: {
    email,
    mode: "signup",
  },
});


 }

//  const onVerifyPress=async()=>{
//   await signUp.verifications.verifyEmailCode({code});

//   if(signUp.status==='complete'){
//     await signUp.finalize({
//       navigate:({decorateUrl})=>{
//         const url=decorateUrl('/');
//         router.replace(url as any);
//       }
//     })
//   }
// }


//   if(
//    signUp.status==='missing_requirements' &&
//    signUp.unverifiedFields.includes('email_address') &&
//    signUp.missingFields.length===0
//   ){
//    return <View className="flex-1 justify-center px-6 py-12">

//              <Image source={require('../../../assets/images/logo.png')}
//              style={styles.image} resizeMode="contain"
//              ></Image>
//              <Text className="text-gray-800 font-bold text-3xl mb-2 ">Verify your Account {" "}</Text>
//              <Text className="text-gray-500 mb-8">We've sent a verification code to {email}.</Text>

//              <View className="flex-row gap-3 mb-4">
//                 <TextInput placeholder="Enter Verification Code" keyboardType="number-pad" placeholderTextColor="#9ca3af"  style={tw`flex-1 border border-gray-300 rounded-xl px-4 py-3`} autoCapitalize="words" value={code} onChangeText={setCode} />
                 
//              </View>

//              {errors.fields.code && (
//                <Text style={tw`text-red-500 mb-4`}>
//                  {errors.fields.code.message}
//                </Text>
//              )}
            
//               <TouchableOpacity onPress={onVerifyPress} disabled={isLoading} style={tw`w-full bg-blue-600 py-4 rounded-xl items-center mb-4`}>
//           {isLoading? (
//            <ActivityIndicator color="white" />
//           ):(
//            <Text style={tw`text-white text-base font-bold`}>Verify</Text>
//           )
//           }


//          </TouchableOpacity>
//           <TouchableOpacity onPress={()=>signUp.verifications.sendEmailCode()} disabled={isLoading} >
//           {isLoading? (
//            <ActivityIndicator color="white" />
//           ):(
//            <Text style={tw`text-blue-600 text-base `}>I need a new code</Text>
//           )
//           }
         


//          </TouchableOpacity>

          
//             </View>
//  }







  return (
    <ScrollView contentContainerStyle={{flexGrow: 1}} className="bg-white"
    keyboardShouldPersistTaps="handled"
    >
        <View className="flex-1 justify-center px-6 py-12">

            <Image source={require('../../../assets/images/logo.png')}
            style={tw`w-40 h-28`} resizeMode="contain"
            ></Image>
            <Text className="text-gray-800 font-bold text-3xl mb-2 ">Create Account</Text>
            <Text className="text-gray-500 mb-8">Find Your Dream Home Today</Text>

            <View className="flex-row gap-3 mb-4">
               <TextInput placeholder="First Name" placeholderTextColor="#9ca3af"  style={tw`flex-1 border border-gray-300 rounded-xl px-4 py-3`} autoCapitalize="words" value={firstName} onChangeText={setFirstName} />
                 <TextInput placeholder="Last Name" placeholderTextColor="#9ca3af" style={tw`flex-1 border border-gray-300 rounded-xl px-4 py-3`} autoCapitalize='words' value={lastName} onChangeText={setLastName} />
            </View>

            <TextInput
            style={tw`w-full border border-gray-300 rounded-xl px-4 py-3 mb-4`}
            placeholder="Email Address"
            placeholderTextColor="#9ca3af"
            value={email}
            keyboardType="email-address"
            onChangeText={setEmail}
            autoCapitalize="none"
            
            />

            {errors.fields.emailAddress && (
              <Text style={tw`text-red-500 mb-4`}>
                {errors.fields.emailAddress.message}
              </Text>
            )}

            <TextInput 
            style={tw`w-full border border-gray-300 rounded-xl px-4 py-3 mb-4`}
            placeholder="Password"
            placeholderTextColor="#9ca3af"
            value={password}
            onChangeText={setPassword}
            autoCapitalize="none"
            secureTextEntry
            />
            {errors.fields.password && (
              <Text style={tw`text-red-500 mb-4`}>
                {errors.fields.password.message}
              </Text>
            )}


        <TouchableOpacity onPress={onSignUpPress} disabled={isLoading} style={tw`w-full bg-blue-600 py-4 rounded-xl items-center mb-4`}>
         {isLoading? (
          <ActivityIndicator color="white" />
         ):(
          <Text style={tw`text-white text-base font-bold`}>SignUp</Text>
         )
         }


        </TouchableOpacity>


        <View style={tw`flex-row justify-center`}>
          <Text style={tw`text-gray-500`}>Already have an Account?</Text>
          <Link href="/sign_in"><Text style={tw`text-blue-600 font-semibold`}>  Sign In</Text></Link>
        </View>

         <View nativeID="clerk-captcha"/>
        </View>

          
        
        
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  image:{
    height:50,
    width:50,
    marginBottom: 8,

  }
});

export default SignUp;