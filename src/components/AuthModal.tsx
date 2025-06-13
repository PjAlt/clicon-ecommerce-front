
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { Eye, EyeOff, X } from 'lucide-react';

type AuthModalProps = {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'login' | 'signup';
};

export const AuthModal = ({ isOpen, onClose, defaultTab = 'login' }: AuthModalProps) => {
  const [activeTab, setActiveTab] = useState<'login' | 'signup' | 'forgot' | 'reset' | 'verify'>(defaultTab);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  
  const { login, register, verifyOtp } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    contact: '',
    otp: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await login(formData.email, formData.password);
      if (response.success) {
        toast({
          title: "Login Successful",
          description: "Welcome back!",
        });
        onClose();
      } else {
        toast({
          title: "Login Failed",
          description: response.message || "Invalid email or password",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Login Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    try {
      const response = await register({
        id: 0,
        name: formData.name,
        email: formData.email,
        password: formData.password,
        contact: formData.contact
      });

      if (response.succeeded) {
        setEmail(formData.email);
        setActiveTab('verify');
        toast({
          title: "Registration Successful",
          description: "Please check your email for verification code",
        });
      }
    } catch (error) {
      toast({
        title: "Registration Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await verifyOtp(email, otp);
      if (response.message === "OTP verified successfully. Account has been created.") {
        toast({
          title: "Email Verified",
          description: "Your account has been created successfully. Please login.",
        });
        setActiveTab('login');
      }
    } catch (error) {
      toast({
        title: "Verification Error",
        description: "Invalid OTP. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderLogin = () => (
    <form onSubmit={handleLogin} className="space-y-4">
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => handleInputChange('email', e.target.value)}
          placeholder="Enter your email"
          required
        />
      </div>
      <div>
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={(e) => handleInputChange('password', e.target.value)}
            placeholder="Enter your password"
            required
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        </div>
      </div>
      <div className="flex justify-between items-center">
        <Button type="button" variant="link" onClick={() => setActiveTab('forgot')} className="p-0">
          Forgot Password?
        </Button>
      </div>
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? 'Signing in...' : 'Sign In'}
      </Button>
      <div className="text-center">
        <span className="text-sm text-gray-600">Don't have an account? </span>
        <Button type="button" variant="link" onClick={() => setActiveTab('signup')} className="p-0">
          Sign up
        </Button>
      </div>
    </form>
  );

  const renderSignup = () => (
    <form onSubmit={handleSignup} className="space-y-4">
      <div>
        <Label htmlFor="name">Full Name</Label>
        <Input
          id="name"
          type="text"
          value={formData.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          placeholder="Enter your full name"
          required
        />
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => handleInputChange('email', e.target.value)}
          placeholder="Enter your email"
          required
        />
      </div>
      <div>
        <Label htmlFor="contact">Phone Number</Label>
        <Input
          id="contact"
          type="tel"
          value={formData.contact}
          onChange={(e) => handleInputChange('contact', e.target.value)}
          placeholder="Enter your phone number"
          required
        />
      </div>
      <div>
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={(e) => handleInputChange('password', e.target.value)}
            placeholder="Create a password"
            required
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        </div>
      </div>
      <div>
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <Input
          id="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
          placeholder="Confirm your password"
          required
        />
      </div>
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? 'Creating Account...' : 'Create Account'}
      </Button>
      <div className="text-center">
        <span className="text-sm text-gray-600">Already have an account? </span>
        <Button type="button" variant="link" onClick={() => setActiveTab('login')} className="p-0">
          Sign in
        </Button>
      </div>
    </form>
  );

  const renderVerifyOtp = () => (
    <form onSubmit={handleVerifyOtp} className="space-y-4">
      <div className="text-center mb-4">
        <h3 className="text-lg font-semibold">Verify Your Email</h3>
        <p className="text-sm text-gray-600">We've sent a verification code to {email}</p>
      </div>
      <div>
        <Label htmlFor="otp">Verification Code</Label>
        <Input
          id="otp"
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="Enter 6-digit code"
          maxLength={6}
          required
        />
      </div>
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? 'Verifying...' : 'Verify Email'}
      </Button>
      <div className="text-center">
        <Button type="button" variant="link" onClick={() => setActiveTab('signup')} className="p-0">
          Back to Sign Up
        </Button>
      </div>
    </form>
  );

  const renderForgotPassword = () => (
    <div className="space-y-4">
      <div className="text-center mb-4">
        <h3 className="text-lg font-semibold">Reset Password</h3>
        <p className="text-sm text-gray-600">Enter your email to receive reset instructions</p>
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="Enter your email"
          required
        />
      </div>
      <Button type="submit" className="w-full">
        Send Reset Link
      </Button>
      <div className="text-center">
        <Button type="button" variant="link" onClick={() => setActiveTab('login')} className="p-0">
          Back to Sign In
        </Button>
      </div>
    </div>
  );

  const getTitle = () => {
    switch (activeTab) {
      case 'login': return 'Sign In';
      case 'signup': return 'Create Account';
      case 'verify': return 'Email Verification';
      case 'forgot': return 'Forgot Password';
      default: return 'Authentication';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">{getTitle()}</DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        <div className="p-6">
          {activeTab === 'login' && renderLogin()}
          {activeTab === 'signup' && renderSignup()}
          {activeTab === 'verify' && renderVerifyOtp()}
          {activeTab === 'forgot' && renderForgotPassword()}
        </div>
      </DialogContent>
    </Dialog>
  );
};
