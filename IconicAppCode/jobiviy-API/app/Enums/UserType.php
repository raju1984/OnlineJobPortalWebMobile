<?php

namespace App\Enums;

use BenSampo\Enum\Enum;

final class UserType extends Enum
{
    const JobtivitiUser = 0;
    const  SuperAdmin= 1;
    const CompanyAdmin = 2;
    const CompanyEmployee= 3;
    const SalesAgent = 4;

    /**
     * Get the description for an enum value
     *
     * @param  int  $value
     * @return string
     */
    public static function getDescription(int $value): string
    {
        switch ($value) {
            case self::JobtivitiUser:
                return 'Jobtiviti User';
            break;
            case self::SuperAdmin:
                 return 'Super Admin';
            break;
            case self::CompanyAdmin:
                 return 'Company Admin';
            break;
            case self::CompanyEmployee:
                 return 'Company Employee';
            break;
            case self::SalesAgent:
                 return 'Sales Agent';
            break;

            default:
                return self::getKey($value);
        }
    }
}
