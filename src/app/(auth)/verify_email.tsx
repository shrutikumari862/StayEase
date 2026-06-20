console.log("VERIFY PAGE");

import React from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAuth, useSignUp, useSignIn } from '@clerk/expo';
import tw from 'twrnc';
import { View, Text, StyleSheet, ScrollView, Image, TextInput,TouchableOpacity,ActivityIndicator } from 'react-native';

const VerifyEmail = () => {

const { signUp, fetchStatus: signUpFetchStatus } = useSignUp();
const { signIn, fetchStatus: signInFetchStatus } = useSignIn();
 const{isSignedIn}=useAuth();
 const [code, setCode] = React.useState('');
  const { email, mode } = useLocalSearchParams<{
    email: string;
    mode: "signup" | "signin";
  }>();
 const router=useRouter();
  const isLoading =
    signUpFetchStatus === "fetching" ||
    signInFetchStatus === "fetching";
  

   React.useEffect(() => {
    if (isSignedIn) {
      router.replace("/");
    }
  }, [isSignedIn]);

  const onVerifyPress = async () => {
    try {
      if (mode === "signup") {
        await signUp.verifications.verifyEmailCode({ code });

        if (signUp.status === "complete") {
          await signUp.finalize({
            navigate: ({ decorateUrl }) => {
              const url = decorateUrl("/");
              router.replace(url as any);
            },
          });
        }
      }

      if (mode === "signin") {
        await signIn.mfa.verifyEmailCode({ code });

        if (signIn.status === "complete") {
          await signIn.finalize({
            navigate: ({ session, decorateUrl }) => {
              if (session?.currentTask) return;

              const url = decorateUrl("/");
              router.replace(url as any);
            },
          });
        }
      }
    } catch (err: any) {
      alert(err?.message || "Verification failed");
    }
  };

  const resendCode = async () => {
    try {
      if (mode === "signup") {
        await signUp.verifications.sendEmailCode();
      }

      if (mode === "signin") {
        await signIn.mfa.sendEmailCode();
      }

      alert("Verification code sent");
    } catch (err: any) {
      alert(err?.message || "Failed to resend code");
    }
  };
   return (
    <View className="flex-1 justify-center px-6 py-12 bg-white">
      <Image
        source={require("../../../assets/images/logo.png")}
        style={tw`w-40 h-28`}
        resizeMode="contain"
      />

      <Text className="text-gray-800 font-bold text-3xl mb-2">
        Verify your Account
      </Text>

      <Text className="text-gray-500 mb-8">
        We've sent a verification code to {email}
      </Text>

      <TextInput
        placeholder="Enter Verification Code"
        keyboardType="number-pad"
        placeholderTextColor="#9ca3af"
        style={tw`border border-gray-300 rounded-xl px-4 py-3 mb-4`}
        value={code}
        onChangeText={setCode}
      />

      <TouchableOpacity
        onPress={onVerifyPress}
        disabled={isLoading}
        style={tw`bg-blue-600 py-4 rounded-xl items-center mb-4`}
      >
        {isLoading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={tw`text-white font-bold text-base`}>
            Verify
          </Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        onPress={resendCode}
        disabled={isLoading}
        style={tw`items-center`}
      >
        <Text style={tw`text-blue-600 text-base`}>
          I need a new code
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default VerifyEmail;