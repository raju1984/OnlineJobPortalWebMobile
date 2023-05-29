<?php

namespace App\Enums;

use BenSampo\Enum\Enum;

final class VerifiedType extends Enum
{
    const InActive = 0;
    const Active = 1;

    /**
     * Get the description for an enum value
     *
     * @param  int  $value
     * @return string
     */
    public static function getDescription(int $value): string
    {
        switch ($value) {
            case self::InActive:
                return 'InActive user';
            break;
            case self::Active:
                return 'Active user';
            break;
            default:
                return self::getKey($value);
        }
    }
}
