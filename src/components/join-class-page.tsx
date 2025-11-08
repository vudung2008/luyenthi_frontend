import React from 'react'
import { Card, CardContent } from './ui/card'
import { Label } from '@radix-ui/react-label'

const JoinClassPage = () => {
    return (
        <div>
            <Card className="overflow-hidden p-0">
                <CardContent>
                    <Label className='block text-sm' htmlFor='classId' >Nhập id class muốn tham gia</Label>
                </CardContent>
            </Card>
        </div>
    )
}

export default JoinClassPage
