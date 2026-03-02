<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class ProfitReportExport implements FromCollection, WithHeadings, WithMapping
{
    protected $reports;

    public function __construct($reports)
    {
        $this->reports = $reports;
    }

    public function collection()
    {
        return $this->reports;
    }

    public function headings(): array
    {
        return [
            'ရက်စွဲ',
            'ကုန်ပစ္စည်းအမည်',
            'အရေအတွက်',
            'ရောင်းစျေး (တစ်ခု)',
            'ဝယ်စျေး (တစ်ခု)',
            'အမြတ်/အရှုံး'
        ];
    }

    public function map($report): array
    {
        return [
            $report['date'],
            $report['product_name'],
            $report['qty'],
            $report['selling_price'],
            $report['buying_price'],
            $report['profit'],
        ];
    }
}
