# backend/app/core/security/webauthn.py

from typing import List, Optional
from webauthn import (
    generate_registration_options,
    verify_registration_response,
    generate_authentication_options,
    verify_authentication_response,
)
from webauthn.helpers.structs import (
    AuthenticatorSelectionCriteria,
    UserVerificationRequirement,
    AttestationConveyancePreference,
)
from app.core.config import settings


# =========================
# Register Options
# =========================


def create_registration_options(user_id, email, challenge: str):
    authenticator_selection = AuthenticatorSelectionCriteria(
        user_verification=UserVerificationRequirement.PREFERRED
    )

    return generate_registration_options(
        rp_id=settings.RP_ID,
        rp_name=settings.RP_NAME,
        user_id=user_id.encode(),
        user_name=email,
        user_display_name=email,
        challenge=challenge.encode(),
        attestation=AttestationConveyancePreference.NONE,
        authenticator_selection=authenticator_selection,
    )


# =========================
# Register Verify
# =========================


def verify_registration(
    credential: dict,
    expected_challenge: str,
):
    verification = verify_registration_response(
        credential=credential,
        expected_challenge=expected_challenge,
        expected_origin=settings.ORIGIN,
        expected_rp_id=settings.RP_ID,
    )

    return verification


# =========================
# Login Options
# =========================


def create_authentication_options(
    challenge: str,
    allow_credentials: Optional[List[dict]] = None,
):
    return generate_authentication_options(
        rp_id=settings.RP_ID,
        allow_credentials=allow_credentials,
        challenge=challenge.encode(),
        user_verification=UserVerificationRequirement.PREFERRED,
    )


# =========================
# Login Verify
# =========================


def verify_authentication(
    credential: dict,
    expected_challenge: str,
    credential_public_key: bytes,
    credential_current_sign_count: int,
):
    verification = verify_authentication_response(
        credential=credential,
        expected_challenge=expected_challenge,
        expected_origin=settings.ORIGIN,
        expected_rp_id=settings.RP_ID,
        credential_public_key=credential_public_key,
        credential_current_sign_count=credential_current_sign_count,
    )

    return verification
