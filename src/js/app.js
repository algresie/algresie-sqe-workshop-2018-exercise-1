import $ from 'jquery';
import {parseCode} from './code-analyzer';

$(document).ready(function () {
    $('#codeSubmissionButton').click(() => {
        let codeToParse = $('#codePlaceholder').val();
        let parsedCode = parseCode(codeToParse);

        $('#parsedCode').val(showTable(parsedCode));
    });
});
const deleterows=(table)=>{
    let num=table.rows.length;
    for (let i=num-1;i>0;i--)
        table.deleteRow(i);
};
const showTable=(l)=>{
    let table = document.getElementById('myTable');
    deleterows(table);
    let j=0;
    for (let i=1;j<l.length;i++)
    {
        let row=table.insertRow(i);
        insertCell(row,l,j);
        j+=5;
    }
};
const insertCell=(row,l,j)=>{
    let cell1=row.insertCell(0);
    let cell2=row.insertCell(1);
    let cell3=row.insertCell(2);
    let cell4=row.insertCell(3);
    let cell5=row.insertCell(4);
    cell1.innerHTML=l[j].toString();
    cell2.innerHTML=l[j+1].toString();
    cell3.innerHTML=l[j+2].toString();
    cell4.innerHTML=l[j+3].toString();
    cell5.innerHTML=l[j+4].toString();
};
