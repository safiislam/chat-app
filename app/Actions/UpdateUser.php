<?php

declare(strict_types=1);

namespace App\Actions;

use App\Data\UserData;
use App\Models\User;
use InvalidArgumentException;

final readonly class UpdateUser
{
    public function handle(User $user, UserData $data): void
    {
        /** @var array<string, mixed> $updates */
        $updates = array_filter($data->toArray(), fn (mixed $value): bool => $value !== null);

        if ($updates === []) {
            return;
        }

        $this->handleEmailUpdate($user, $updates);

        $user->update($updates);
    }

    /**
     * Handle email update validation and verification reset.
     *
     * @param  array<string, mixed>  &$updates
     */
    private function handleEmailUpdate(User $user, array &$updates): void
    {
        if (! array_key_exists('email', $updates)) {
            return;
        }

        $email = mb_trim((string) $updates['email']);

        // Remove empty email from updates
        if ($email === '') {
            unset($updates['email']);

            return;
        }

        // No change, keep existing verification
        if ($email === $user->email) {
            return;
        }

        // Check email availability
        throw_if($this->isEmailTaken($email, $user->id), InvalidArgumentException::class, 'The provided email is already taken.');

        // Reset email verification for new email
        $updates['email_verified_at'] = null;
    }

    private function isEmailTaken(string $email, int $userId): bool
    {
        return User::query()
            ->where('email', $email)
            ->where('id', '<>', $userId)
            ->exists();
    }
}
