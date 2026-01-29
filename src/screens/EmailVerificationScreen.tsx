import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../types/navigation";
import api from "../services/api";

interface EmailVerificationScreenProps {
  navigation: NativeStackNavigationProp<RootStackParamList, "EmailVerification">;
  route: RouteProp<RootStackParamList, "EmailVerification">;
}

export default function EmailVerificationScreen({
  navigation,
  route,
}: EmailVerificationScreenProps) {
  const { email, role } = route.params;
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef<(TextInput | null)[]>([]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  const handleOtpChange = (value: string, index: number) => {
    if (value.length > 1) {
      value = value.charAt(value.length - 1);
    }

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const otpCode = otp.join("");

    if (otpCode.length !== 6) {
      Alert.alert("Error", "Please enter the complete 6-digit OTP");
      return;
    }

    setLoading(true);

    try {
      const response = await api.post("/auth/verify-email", {
        email,
        otp: otpCode,
      });

      if (response.success) {
        Alert.alert(
          "Success",
          "Email verified successfully! You can now sign in.",
          [
            {
              text: "OK",
              onPress: () => navigation.navigate("SignIn", {}),
            },
          ]
        );
      } else {
        Alert.alert("Error", response.message || "Invalid OTP");
      }
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to verify email");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!canResend) return;

    setResendLoading(true);

    try {
      const response = await api.post("/auth/resend-verification-otp", {
        email,
      });

      if (response.success) {
        Alert.alert("Success", "A new OTP has been sent to your email");
        setCountdown(60);
        setCanResend(false);
        setOtp(["", "", "", "", "", ""]);
      } else {
        Alert.alert("Error", response.message || "Failed to resend OTP");
      }
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to resend OTP");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Back Button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate("SignUp")}
          disabled={loading}
        >
          <Ionicons name="arrow-back" size={24} color="#0E7490" />
          <Text style={styles.backButtonText}>Back to Sign Up</Text>
        </TouchableOpacity>

        <View style={styles.content}>
          <View style={styles.iconContainer}>
            <Ionicons name="mail-outline" size={60} color="#0E7490" />
          </View>

          <Text style={styles.title}>Verify Your Email</Text>
          <Text style={styles.subtitle}>
            We've sent a 6-digit verification code to:
          </Text>
          <Text style={styles.emailText}>{email}</Text>

          {/* OTP Input */}
          <View style={styles.otpContainer}>
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                ref={(ref) => { inputRefs.current[index] = ref; }}
                style={[
                  styles.otpInput,
                  digit ? styles.otpInputFilled : null,
                ]}
                value={digit}
                onChangeText={(value) => handleOtpChange(value, index)}
                onKeyPress={(e) => handleKeyPress(e, index)}
                keyboardType="number-pad"
                maxLength={1}
                selectTextOnFocus
              />
            ))}
          </View>

          {/* Verify Button */}
          <TouchableOpacity
            style={[
              styles.verifyButton,
              loading && styles.verifyButtonDisabled,
            ]}
            onPress={handleVerify}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.verifyButtonText}>Verify Email</Text>
            )}
          </TouchableOpacity>

          {/* Resend OTP */}
          <View style={styles.resendContainer}>
            <Text style={styles.resendText}>Didn't receive the code? </Text>
            {canResend ? (
              <TouchableOpacity
                onPress={handleResendOtp}
                disabled={resendLoading}
              >
                {resendLoading ? (
                  <ActivityIndicator size="small" color="#0E7490" />
                ) : (
                  <Text style={styles.resendLink}>Resend OTP</Text>
                )}
              </TouchableOpacity>
            ) : (
              <Text style={styles.countdownText}>
                Resend in {countdown}s
              </Text>
            )}
          </View>

          {/* Skip for now - development only */}
          <TouchableOpacity
            style={styles.skipButton}
            onPress={() => navigation.navigate("SignIn", {})}
          >
            <Text style={styles.skipText}>Skip for now</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0F9E8",
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
  },
  backButtonText: {
    color: "#0E7490",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  scrollContent: {
    paddingBottom: 40,
    paddingHorizontal: 20,
  },
  content: {
    alignItems: "center",
    paddingTop: 20,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#E0F2FE",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#0E7490",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 5,
  },
  emailText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 30,
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 10,
    marginBottom: 30,
  },
  otpInput: {
    width: 48,
    height: 56,
    borderWidth: 2,
    borderColor: "#D1D5DB",
    borderRadius: 12,
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
    backgroundColor: "#FFFFFF",
    color: "#374151",
  },
  otpInputFilled: {
    borderColor: "#0E7490",
    backgroundColor: "#E0F2FE",
  },
  verifyButton: {
    backgroundColor: "#0E7490",
    borderRadius: 25,
    paddingVertical: 16,
    paddingHorizontal: 40,
    width: "100%",
    alignItems: "center",
    marginBottom: 20,
  },
  verifyButtonDisabled: {
    backgroundColor: "#9CA3AF",
  },
  verifyButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
  resendContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  resendText: {
    fontSize: 14,
    color: "#6B7280",
  },
  resendLink: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0E7490",
  },
  countdownText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#9CA3AF",
  },
  skipButton: {
    paddingVertical: 10,
  },
  skipText: {
    fontSize: 14,
    color: "#9CA3AF",
    textDecorationLine: "underline",
  },
});
