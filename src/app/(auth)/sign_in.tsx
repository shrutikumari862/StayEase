

import { useAuth, useSignIn } from "@clerk/expo";
import React from "react";
import tw from "twrnc";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { Link } from "expo-router";
import VerifyEmail from "./verify_email";

const SignIn = () => {
  const { signIn, errors, fetchStatus } = useSignIn();
  const { isSignedIn } = useAuth();
  const router = useRouter();

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [code, setCode] = React.useState("");
  const isLoading = fetchStatus === "fetching";

  if (signIn.status === "complete" || isSignedIn) {
    return null;
  }

  const onSignInPress = async () => {
  try {
    const { error } = await signIn.password({
      emailAddress: email,
      password,
    });

    if (error) {
      alert(error.message);
      return;
    }

    console.log("SignIn Status:", signIn.status);

    if (signIn.status === "complete") {
      await signIn.finalize({
        navigate: ({ session, decorateUrl }) => {
          if (session?.currentTask) {
            console.log(session.currentTask);
            return;
          }

          const url = decorateUrl("/");
          router.replace(url as any);
        },
      });
    } else if (signIn.status === "needs_second_factor") {
      await signIn.mfa.sendPhoneCode();
    } else if (signIn.status === "needs_client_trust") {
      const emailCodeFactor = signIn.supportedSecondFactors.find(
        (factor) => factor.strategy === "email_code"
      );

      if (emailCodeFactor) {
        await signIn.mfa.sendEmailCode();

        router.push({
          pathname: "/verify_email",
          params: {
            email,
            mode: "signin",
          },
        });
      }
    } else {
      console.error("Sign in attempt not complete:", signIn.status);
    }
  } catch (err: any) {
    console.error(err);
    alert(err?.message || "Sign in failed");
  }
};

  const onVerifyPress = async () => {
    await signIn.mfa.verifyEmailCode({ code });

    if (signIn.status === "complete") {
      await signIn.finalize({
        navigate: ({ session, decorateUrl }) => {
          if (session?.currentTask) {
            console.log(session?.currentTask);
            return;
          }

          const url = decorateUrl("/");
          router.replace(url as any);
        },
      });
    }
  };



  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      className="bg-white"
      keyboardShouldPersistTaps="handled"
    >
      <View className="flex-1 justify-center px-6 py-12">
        <Image
          source={require("../../../assets/images/logo.png")}
          style={tw`w-40 h-28`}
          resizeMode="contain"
        ></Image>
        <Text className="text-gray-800 font-bold text-3xl mb-2 ">
          Welcome Back
        </Text>
        <Text className="text-gray-500 mb-8">Sign in to your account</Text>

        <TextInput
          style={tw`w-full border border-gray-300 rounded-xl px-4 py-3 mb-4`}
          placeholder="Email Address"
          placeholderTextColor="#9ca3af"
          value={email}
          keyboardType="email-address"
          onChangeText={setEmail}
          autoCapitalize="none"
        />

        {errors.fields.identifier && (
          <Text style={tw`text-red-500 mb-4`}>
            {errors.fields.identifier.message}
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

        <TouchableOpacity
          onPress={onSignInPress}
          disabled={isLoading}
          style={tw`w-full bg-blue-600 py-4 rounded-xl items-center mb-4`}
        >
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={tw`text-white text-base font-bold`}>SignIn</Text>
          )}
        </TouchableOpacity>

        <View style={tw`flex-row justify-center`}>
          <Text style={tw`text-gray-500`}>Don't have an Account?</Text>
          <Link href="/sign_up">
            <Text style={tw`text-blue-600 font-semibold`}> Sign Up</Text>
          </Link>
        </View>

        <View nativeID="clerk-captcha" />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  image: {
    height: 50,
    width: 50,
    marginBottom: 8,
  },
});

export default SignIn;
