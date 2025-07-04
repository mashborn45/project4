// app/signup.tsx
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router'; // Import useRouter for navigation
import React, { useState } from 'react';
import {
    Dimensions,
    Image,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

const { width, height } = Dimensions.get('window');

export default function SignUpScreen() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const router = useRouter(); // Initialize router for navigation

  const handleSignUp = () => {
    console.log('Sign Up Pressed');
    console.log({ fullName, email, password, confirmPassword, rememberMe });
  };

  const handleGoogleSignUp = () => {
    console.log('Sign up with Google Pressed');
  };

  const handleForgotPassword = () => {
    console.log('Forgot Password Pressed');
  };

  const handleLogin = () => {
    console.log('Log In Pressed from Sign Up Page');
    router.replace('/login'); // Navigate to the login page
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Image
          source={require('../assets/images/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />

        <Text style={styles.title}>Create Your Account</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Full Name:</Text>
          <TextInput
            style={styles.input}
            placeholder="Full Name"
            placeholderTextColor="#888"
            value={fullName}
            onChangeText={setFullName}
            autoCapitalize="words"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email Address:</Text>
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#888"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Password:</Text>
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#888"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Confirm Password:</Text>
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#888"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />
        </View>

        <View style={styles.optionsContainer}>
          <TouchableOpacity
            style={styles.rememberMeCheckboxContainer}
            onPress={() => setRememberMe(!rememberMe)}
          >
            <Text style={styles.rememberMeText}>Remember Me</Text>
            <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
              {rememberMe && (
                <FontAwesome name="check" size={14} color="white" />
              )}
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleForgotPassword}>
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp}>
          <Text style={styles.signUpButtonText}>Sign Up</Text>
        </TouchableOpacity>

        <View style={styles.separatorContainer}>
          <View style={styles.line} />
          <Text style={styles.orText}>or</Text>
          <View style={styles.line} />
        </View>

        <TouchableOpacity style={styles.googleButton} onPress={handleGoogleSignUp}>
          <Image
            source={{ uri: 'https://cdn-icons-png.flaticon.com/512/281/281764.png' }}
            style={styles.googleIcon}
          />
          <Text style={styles.googleButtonText}>Sign up with Google</Text>
        </TouchableOpacity>

        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>Already have an account?</Text>
          <TouchableOpacity onPress={handleLogin}>
            <Text style={styles.loginLink}> Log In</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flexGrow: 1,
    alignItems: 'center',
    paddingVertical: height * 0.05,
    paddingHorizontal: width * 0.05,
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  logo: {
    width: width * 1.45, // **Logo width increased**
    height: height * 0.35, // **Logo height increased**
    marginBottom: height * -0.06,
    marginTop: height * -0.05, // **Logo margin adjusted to fit the screen better**
  },
  title: {
    fontSize: width * 0.07,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: height * 0.04,
    textAlign: 'center',
  },
  inputGroup: {
    width: '100%',
    marginBottom: height * 0.02,
  },
  label: {
    fontSize: width * 0.04,
    color: '#333',
    marginBottom: 5,
  },
  input: {
    width: '100%',
    height: height * 0.055,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: width * 0.04,
    color: '#000',
    borderWidth: 1,
    borderColor: '#CCC',
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: height * 0.03,
    alignItems: 'center',
  },
  rememberMeCheckboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: '#888',
    borderRadius: 5,
    marginLeft: 8,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#28a745',
    borderColor: '#28a745',
  },
  rememberMeText: {
    color: '#333',
    fontSize: width * 0.035,
  },
  forgotPasswordText: {
    color: '#007bff',
    fontSize: width * 0.035,
  },
  signUpButton: {
    width: '100%',
    height: height * 0.055,
    backgroundColor: '#28a745',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: height * 0.02,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  signUpButtonText: {
    color: '#fff',
    fontSize: width * 0.05,
    fontWeight: 'bold',
  },
  separatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: height * 0.02,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#BBB',
  },
  orText: {
    color: '#888',
    marginHorizontal: 10,
    fontSize: width * 0.035,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: height * 0.055,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  googleIcon: {
    width: width * 0.06,
    height: width * 0.06,
    marginRight: 10,
  },
  googleButtonText: {
    color: '#000',
    fontSize: width * 0.045,
    fontWeight: 'bold',
  },
  loginContainer: {
    flexDirection: 'row',
    marginTop: height * 0.03,
  },
  loginText: {
    color: '#333',
    fontSize: width * 0.038,
  },
  loginLink: {
    color: '#28a745',
    fontSize: width * 0.038,
    fontWeight: 'bold',
  },
});
