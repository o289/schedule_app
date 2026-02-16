import { apiFetch } from "../api/client";
import {
  startRegistration,
  startAuthentication,
} from "../utils/webauthn/webauthn";
import {
  formatRegistrationCredential,
  formatAuthenticationCredential,
} from "../utils/webauthn/credentialFormatter";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BaseForm from "../components/forms/BaseForm";
import FormField from "../components/forms/FormField";

export default function EntrancePage() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { setAccessToken, setRefreshToken, setUser } = useAuth();
  const navigate = useNavigate();

  const executeLoginFlow = async (email) => {
    const loginOptionsRes = await apiFetch(
      "/auth/passkey/login/options",
      {
        method: "POST",
        body: JSON.stringify({ email }),
      },
      null,
      { silentCodes: ["PASSKEY_NOT_FOUND"] }
    );

    const loginPublicKey = loginOptionsRes.data.publicKey;

    const authenticationCredential = await startAuthentication(loginPublicKey);

    const formattedAuthentication = formatAuthenticationCredential(
      authenticationCredential
    );

    const verifyRes = await apiFetch("/auth/passkey/login/verify", {
      method: "POST",
      body: JSON.stringify(formattedAuthentication),
    });

    const { access_token, refresh_token } = verifyRes.data;

    setAccessToken(access_token);
    setRefreshToken(refresh_token);
    localStorage.setItem("accessToken", access_token);
    localStorage.setItem("refreshToken", refresh_token);

    const meRes = await apiFetch(
      "/auth/me",
      { method: "GET" },
      {
        accessToken: access_token,
        refreshToken: refresh_token,
      }
    );

    setUser(meRes);
    navigate("/");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) return;

    setIsSubmitting(true);

    try {
      // 1. Try login first
      try {
        await executeLoginFlow(email);
        return;
      } catch (loginError) {
        if (loginError?.code !== "PASSKEY_NOT_FOUND") {
          throw loginError;
        }
      }

      // 2. If no passkey found, proceed with registration
      const registerOptionsRes = await apiFetch(
        "/auth/passkey/register/options",
        {
          method: "POST",
          body: JSON.stringify({ email }),
        }
      );

      const registerPublicKey = registerOptionsRes.data.publicKey;

      const registrationCredential = await startRegistration(registerPublicKey);

      const formattedRegistration = formatRegistrationCredential(
        registrationCredential
      );

      await apiFetch("/auth/passkey/register/verify", {
        method: "POST",
        body: JSON.stringify(formattedRegistration),
      });

      // After successful registration, login
      await executeLoginFlow(email);
    } catch (error) {
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <BaseForm
        onSubmit={handleSubmit}
        submitLabel="アプリの利用を開始"
        disabled={isSubmitting}
      >
        <FormField label="メールアドレス">
          <input
            type="email"
            name="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </FormField>
      </BaseForm>
    </>
  );
}
