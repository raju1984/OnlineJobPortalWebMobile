<?php

namespace App\Enums;

use BenSampo\Enum\Enum;

final class StatusType extends Enum
{
    const InActive = 0;
    const Active = 1;
    const Remove = 2;

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
                return 'InActive Status';
            break;
            case self::Active:
                return 'Active Status';
            break;
            case self::Remove:
                return 'Remove';
            break;

            default:
                return self::getKey($value);
        }
    }
}
