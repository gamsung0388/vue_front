 <template>
    <div>
        <table border="1">
            <thead>
                <tr>
                    <th><input type="checkbox" value="all"></th>
                    <th>번호</th>
                    <th>제목</th>
                    <th>작성자</th>
                    <th>조회수</th>          
                    <th>등록날짜</th>
                    <th>수정날짜</th>        
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td><input type="checkbox"></td>
                </tr>
            </tbody>
                        
        </table>
    </div>
</template>
 <script>
import axios from 'axios';

export default{
    name : "managerPage",
    data () {
        return{

        }
    },
    
}

</script>