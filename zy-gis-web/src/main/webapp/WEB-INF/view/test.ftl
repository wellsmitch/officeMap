<h1>Test1.......</h1>
<style>
    table td {
        border: 1px solid #00F7DE;
    }
</style>
<table>
    <#list arr as aVal>
        <tr>
            <#list aVal as aVal1>
                <td>${aVal1}</td>
            </#list>
        </tr>
    </#list>

</table>

<script type="text/javascript">
</script>
